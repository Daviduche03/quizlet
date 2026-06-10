import { Audio } from 'expo-av';
import { createChatCompletion } from '@/lib/openai/chat';
import { AI_THERAPY_SYSTEM_PROMPT } from '@/lib/openai/systemPrompt';

export type VoiceState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking';

export type VoiceCallbacks = {
  onStateChange: (state: VoiceState) => void;
  onTranscript: (text: string) => void;
  onAIResponse: (text: string) => void;
  onError: (message: string) => void;
  onDone: () => void;
};

let recording: Audio.Recording | null = null;
let sound: Audio.Sound | null = null;
let cb: VoiceCallbacks | null = null;
let lastRecordingDurationMillis = 0;

export function setVoiceCallbacks(callbacks: VoiceCallbacks) {
  cb = callbacks;
}

export async function requestMicPermission(): Promise<boolean> {
  const { granted } = await Audio.requestPermissionsAsync();
  return granted;
}

export async function startRecording() {
  lastRecordingDurationMillis = 0;
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
  const { recording: rec } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  );
  recording = rec;
  cb?.onStateChange('recording');
}

export async function stopRecording(): Promise<string | null> {
  if (!recording) return null;
  const status = await recording.getStatusAsync().catch(() => null);
  lastRecordingDurationMillis = status?.durationMillis || 0;
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  recording = null;
  return uri;
}

export async function transcribeAudio(uri: string): Promise<string> {
  cb?.onStateChange('transcribing');
  const apiKey = getApiKey();
  const model = process.env.EXPO_PUBLIC_OPENAI_TRANSCRIBE_MODEL?.trim() || 'gpt-4o-mini-transcribe';

  const text = await transcribeAudioWithModel(uri, apiKey, model);
  if (text) {
    cb?.onTranscript(text);
    return text;
  }

  if (model !== 'whisper-1') {
    const fallbackText = await transcribeAudioWithModel(uri, apiKey, 'whisper-1');
    if (fallbackText) {
      cb?.onTranscript(fallbackText);
      return fallbackText;
    }
  }

  throw new Error(
    `The microphone recorded ${formatDuration(lastRecordingDurationMillis)}, but transcription returned empty text.`,
  );
}

async function transcribeAudioWithModel(uri: string, apiKey: string, model: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'audio.m4a';
  const ext = filename.split('.').pop() || 'm4a';
  formData.append('file', { uri, name: filename, type: mimeTypeForExtension(ext) } as any);
  formData.append('model', model);
  formData.append('response_format', 'json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  const raw = await res.text();
  let data: { text?: string; error?: { message?: string } };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error(`Transcription returned invalid JSON: ${raw.slice(0, 160)}`);
  }

  if (!res.ok) throw new Error(data.error?.message || 'Transcription failed');

  return (data.text || '').trim();
}

export async function getAIResponse(text: string): Promise<string> {
  cb?.onStateChange('thinking');
  const response = await createChatCompletion([
    { role: 'system', content: AI_THERAPY_SYSTEM_PROMPT },
    { role: 'user', content: text },
  ]);
  cb?.onAIResponse(response);
  return response;
}

export async function speakText(text: string) {
  cb?.onStateChange('speaking');
  const apiKey = getApiKey();
  const model = process.env.EXPO_PUBLIC_OPENAI_TTS_MODEL?.trim() || 'gpt-4o-mini-tts';
  const voice = process.env.EXPO_PUBLIC_OPENAI_TTS_VOICE?.trim() || 'marin';

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text,
      voice,
      instructions: 'Speak calmly and naturally, like a supportive therapist. Keep the pacing conversational.',
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error');
    throw new Error(`TTS failed: ${err.slice(0, 200)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  const dataUri = `data:audio/mp3;base64,${base64}`;

  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
  });

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: dataUri },
    { shouldPlay: true },
  );
  sound = newSound;

  return new Promise<void>((resolve) => {
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        cb?.onDone();
        resolve();
      }
    });
  });
}

export async function abortPlayback() {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
}

export async function cleanup() {
  await abortPlayback();
  if (recording) {
    await recording.stopAndUnloadAsync().catch(() => {});
    recording = null;
  }
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY in your .env file.');
  }
  return key;
}

function mimeTypeForExtension(ext: string): string {
  const normalized = ext.toLowerCase();
  if (normalized === 'm4a' || normalized === 'mp4') return 'audio/mp4';
  if (normalized === 'mp3') return 'audio/mpeg';
  if (normalized === 'wav') return 'audio/wav';
  if (normalized === 'webm') return 'audio/webm';
  if (normalized === '3gp') return 'audio/3gpp';
  return `audio/${normalized}`;
}

function formatDuration(durationMillis: number): string {
  if (!durationMillis) return '0 seconds';
  return `${(durationMillis / 1000).toFixed(1)} seconds`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
