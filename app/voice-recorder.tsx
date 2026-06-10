import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, Loader, Mic, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  requestMicPermission,
  setVoiceCallbacks,
  startRecording,
  stopRecording,
  transcribeAudio,
  getAIResponse,
  speakText,
  abortPlayback,
  cleanup,
  type VoiceState,
} from '@/lib/voice';

export default function VoiceRecorderScreen() {
  const insets = useSafeAreaInsets();
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isPressed, setIsPressed] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const [permGranted, setPermGranted] = useState(false);

  useEffect(() => {
    requestMicPermission().then(setPermGranted);
    setVoiceCallbacks({
      onStateChange: setVoiceState,
      onTranscript: setTranscript,
      onAIResponse: setAiResponse,
      onError: (msg) => setError(msg),
      onDone: () => {},
    });
    return () => { cleanup(); };
  }, []);

  const handlePressIn = useCallback(async () => {
    if (!permGranted) {
      setError('Microphone permission required');
      return;
    }
    setError('');
    setTranscript('');
    setAiResponse('');
    setVoiceState('idle');
    setIsPressed(true);
    try {
      await startRecording();
    } catch (e: any) {
      setError(e.message || 'Failed to start recording');
      setIsPressed(false);
    }
  }, [permGranted]);

  const handlePressOut = useCallback(async () => {
    setIsPressed(false);
    try {
      const uri = await stopRecording();
      if (!uri) throw new Error('No audio recorded');
      const text = await transcribeAudio(uri);
      const response = await getAIResponse(text);
      await speakText(response);
      setVoiceState('idle');
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
      setVoiceState('idle');
    }
  }, []);

  const close = () => {
    abortPlayback();
    router.back();
  };

  const done = () => {
    abortPlayback();
    router.back();
  };

  const stateLabel = (): string => {
    switch (voiceState) {
      case 'recording': return 'Recording... Release to stop';
      case 'transcribing': return 'Transcribing...';
      case 'thinking': return 'Thinking...';
      case 'speaking': return 'Speaking...';
      default: return 'Press and hold to record';
    }
  };

  const isActive = voiceState === 'recording';
  const isProcessing = voiceState === 'transcribing' || voiceState === 'thinking' || voiceState === 'speaking';
  const showTranscript = transcript && voiceState !== 'recording';
  const showAiResponse = aiResponse && (voiceState === 'speaking' || voiceState === 'idle');
  const showDone = !!aiResponse && voiceState === 'idle' && !error;

  return (
    <View className="flex-1 bg-[#1c1c1e]">
      <View style={{ paddingTop: insets.top + 10 }} className="flex-row justify-between items-center px-6">
        <TouchableOpacity
          onPress={close}
          className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center"
        >
          <X size={20} color="#636366" />
        </TouchableOpacity>

        {showDone ? (
          <TouchableOpacity
            onPress={done}
            className="flex-row items-center bg-[#4677b1] rounded-full px-5 py-2.5"
          >
            <Check size={18} color="white" />
            <Text className="text-white text-base font-bold ml-2">Done</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="flex-1 items-center justify-center -mt-20">
        {showAiResponse ? (
          <ScrollView className="max-h-40 w-full px-8 mb-4">
            <Text className="text-purple-400 text-sm font-semibold mb-1 text-center">AI Response</Text>
            <Text className="text-white text-base leading-6 text-center">{aiResponse}</Text>
          </ScrollView>
        ) : null}

        {showTranscript && !showAiResponse ? (
          <ScrollView className="max-h-40 w-full px-8 mb-4">
            <Text className="text-gray-400 text-sm font-semibold mb-1 text-center">You said</Text>
            <Text className="text-white text-xl font-semibold text-center leading-7">
              {transcript}
            </Text>
          </ScrollView>
        ) : null}

        {voiceState === 'idle' && !transcript && !error ? (
          <Text className="text-gray-500 text-lg font-semibold mb-8" />
        ) : null}

        {error ? (
          <Text className="text-red-400 text-base font-semibold mb-4 text-center px-8">{error}</Text>
        ) : null}

        <View className="items-center justify-center">
          {(isActive || isProcessing) ? (
            <>
              <View className="absolute w-64 h-64 rounded-full border-2 border-purple-500/20" />
              <View className="absolute w-56 h-56 rounded-full border-2 border-purple-500/30" />
              <View className="absolute w-48 h-48 rounded-full border-2 border-purple-500/40" />
            </>
          ) : null}

          {isProcessing ? (
            <View className="w-32 h-32 rounded-full bg-[#2c2c2e] items-center justify-center">
              <Loader size={48} color="#8b5cf6" />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isActive ? ['#8b5cf6', '#ec4899'] : ['#3a3a3c', '#2c2c2e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: isActive ? 140 : 120,
                  height: isActive ? 140 : 120,
                  borderRadius: isActive ? 70 : 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mic
                  size={isActive ? 56 : 48}
                  color={isActive ? 'white' : '#636366'}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-gray-400 text-base font-semibold mt-8">
          {error ? 'Tap to try again' : stateLabel()}
        </Text>
      </View>
    </View>
  );
}
