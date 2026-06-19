import { AI_THERAPY_SYSTEM_PROMPT, createStreamingChatCompletion } from '@/lib/openai';
import type { OpenAIChatMessage } from '@/lib/openai/types';
import {
  abortPlayback,
  cleanup,
  requestMicPermission,
  speakText,
  startRecording,
  stopRecording,
  transcribeAudio,
} from '@/lib/voice';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mic, Send, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChatBubble = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
};

type VoiceStatus = 'idle' | 'recording' | 'transcribing' | 'speaking';

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');

  const isBusy = isSending || voiceStatus !== 'idle';
  const isRecording = voiceStatus === 'recording';

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isSending, voiceStatus]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const statusText = () => {
    if (voiceStatus === 'recording') return 'Listening... release to send';
    if (voiceStatus === 'transcribing') return 'Turning your voice into text...';
    if (voiceStatus === 'speaking') return 'Speaking the response...';
    if (isSending) return 'AI is replying...';
    return 'Hold the mic to talk';
  };

  const submitMessage = useCallback(
    async (text: string, speakReply = false) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const timestamp = Date.now();
      const userBubble: ChatBubble = {
        id: `u-${timestamp}`,
        role: 'user',
        content: trimmed,
      };
      const assistantId = `a-${timestamp}`;
      const assistantBubble: ChatBubble = {
        id: assistantId,
        role: 'assistant',
        content: '',
        pending: true,
      };
      const nextHistory = [...messages, userBubble];

      setMessages([...nextHistory, assistantBubble]);
      setMessage('');
      setIsSending(true);

      const apiMessages: OpenAIChatMessage[] = [
        { role: 'system', content: AI_THERAPY_SYSTEM_PROMPT },
        ...nextHistory.map(({ role, content }) => ({ role, content })),
      ];

      try {
        const reply = await createStreamingChatCompletion(apiMessages, {
          onDelta: (_delta, fullText) => {
            setMessages((prev) =>
              prev.map((item) =>
                item.id === assistantId
                  ? { ...item, content: fullText, pending: false }
                  : item,
              ),
            );
          },
        });

        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? { ...item, content: reply, pending: false }
              : item,
          ),
        );

        if (speakReply && reply) {
          setVoiceStatus('speaking');
          try {
            await speakText(reply);
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Could not play the voice response.';
            Alert.alert('Voice playback failed', msg);
          }
        }
      } catch (err) {
        setMessages((prev) => prev.filter((item) => item.id !== assistantId));
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        Alert.alert('Could not reach AI', msg);
      } finally {
        setIsSending(false);
        setVoiceStatus('idle');
      }
    },
    [isSending, messages],
  );

  const handleSend = useCallback(() => {
    submitMessage(message);
  }, [message, submitMessage]);

  const handleMicPressIn = useCallback(async () => {
    if (isBusy) return;

    try {
      await abortPlayback();
      const granted = await requestMicPermission();
      if (!granted) {
        Alert.alert('Microphone needed', 'Please allow microphone access to chat by voice.');
        return;
      }

      setVoiceStatus('recording');
      await startRecording();
    } catch (err) {
      setVoiceStatus('idle');
      const msg = err instanceof Error ? err.message : 'Could not start recording.';
      Alert.alert('Voice unavailable', msg);
    }
  }, [isBusy]);

  const handleMicPressOut = useCallback(async () => {
    if (!isRecording) return;

    try {
      setVoiceStatus('transcribing');
      const uri = await stopRecording();
      if (!uri) {
        setVoiceStatus('idle');
        return;
      }

      const transcript = await transcribeAudio(uri);
      if (!transcript) {
        setVoiceStatus('idle');
        Alert.alert('Nothing heard', 'The recording uploaded, but transcription came back empty.');
        return;
      }

      await submitMessage(transcript, true);
    } catch (err) {
      setVoiceStatus('idle');
      const msg = err instanceof Error ? err.message : 'Voice chat failed.';
      Alert.alert('Voice chat failed', msg);
    }
  }, [isRecording, submitMessage]);

  const close = async () => {
    await abortPlayback();
    router.push('/');
  };

  return (
    <View className="flex-1 bg-[#1c1c1e]">
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row items-center justify-between px-4 pb-4 bg-[#1c1c1e] z-10"
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 overflow-hidden border border-white/10">
            <Image source={require('@/assets/images/logo.jpeg')} className="w-full h-full" resizeMode="contain" />
          </View>
          <View>
            <Text className="text-white text-lg font-bold">AI Therapy</Text>
            <Text className="text-blue-400 text-xs">
              Your check-in between sessions • <Text className="text-green-400">online</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={close}
          className="w-8 h-8 rounded-full bg-[#2c2c2e] items-center justify-center"
        >
          <X size={18} color="#636366" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-20 opacity-50">
              <Text className="text-gray-500 text-center">Start a conversation with your AI Therapist</Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                className={`mb-4 max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[#2c2c2e] self-end rounded-tr-none'
                    : 'bg-[#3a3a3c] self-start rounded-tl-none'
                }`}
              >
                {msg.pending && !msg.content ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#a1a1aa" size="small" />
                    <Text className="text-gray-400 text-sm ml-2">Thinking...</Text>
                  </View>
                ) : (
                  <Text className="text-white text-base leading-6">{msg.content}</Text>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <View className="px-4 pb-8 bg-[#1c1c1e]">
          <Text className="text-gray-500 text-xs mb-2 text-center">{statusText()}</Text>
          <View className="flex-row items-center bg-[#2c2c2e] rounded-full p-1.5 pl-2">
            <TouchableOpacity
              className="mr-2"
              activeOpacity={1}
              onPressIn={handleMicPressIn}
              onPressOut={handleMicPressOut}
              disabled={isSending || voiceStatus === 'transcribing' || voiceStatus === 'speaking'}
            >
              <LinearGradient
                colors={isRecording ? ['#ef4444', '#ec4899'] : ['#8b5cf6', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {voiceStatus === 'transcribing' || voiceStatus === 'speaking' ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Mic size={20} color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your message..."
              placeholderTextColor="#636366"
              className="flex-1 text-white text-base h-10 px-2"
              editable={!isBusy}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim() || isBusy}
            >
              <LinearGradient
                colors={message.trim() && !isBusy ? ['#8b5cf6', '#ec4899'] : ['#3a3a3c', '#3a3a3c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSending ? (
                  <ActivityIndicator color="#a1a1aa" size="small" />
                ) : (
                  <Send size={20} color={message.trim() && !isBusy ? 'white' : '#636366'} style={{ marginLeft: 2 }} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
