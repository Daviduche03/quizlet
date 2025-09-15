import { router } from 'expo-router';
import {
    BookOpen,
    Bot,
    Calculator,
    ChevronLeft,
    Lightbulb,
    Send,
    User
} from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function AIChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI study assistant. I can help you with math problems, explain concepts, or answer any questions about your studies. How can I help you today?",
      isAI: true,
      timestamp: "Just now"
    }
  ]);

  const quickPrompts = [
    { icon: <Calculator size={16} color="#3b82f6" />, text: "Help with math", color: "bg-blue-100" },
    { icon: <BookOpen size={16} color="#10b981" />, text: "Explain a concept", color: "bg-green-100" },
    { icon: <Lightbulb size={16} color="#f59e0b" />, text: "Study tips", color: "bg-yellow-100" }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isAI: false,
        timestamp: "Now"
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I understand you're asking about that topic. Let me help you break it down step by step...",
          isAI: true,
          timestamp: "Now"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessage(promptText);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-6 shadow-sm">
        <View className="flex-row items-center">
          <Pressable 
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3"
            onPress={() => router.push('/(tabs)')}
          >
            <ChevronLeft size={20} color="#374151" />
          </Pressable>
          <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mr-3">
            <Bot size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">AI Study Assistant</Text>
            <Text className="text-sm text-green-600">Online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} className={`mb-4 ${msg.isAI ? 'items-start' : 'items-end'}`}>
            <View className={`flex-row items-end max-w-[80%] ${msg.isAI ? '' : 'flex-row-reverse'}`}>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${msg.isAI ? 'bg-blue-100 mr-2' : 'bg-gray-200 ml-2'}`}>
                {msg.isAI ? (
                  <Bot size={16} color="#3b82f6" />
                ) : (
                  <User size={16} color="#6b7280" />
                )}
              </View>
              <View className={`rounded-2xl px-4 py-3 ${msg.isAI ? 'bg-white border border-gray-100' : 'bg-blue-600'}`}>
                <Text className={`text-base ${msg.isAI ? 'text-gray-800' : 'text-white'}`}>
                  {msg.text}
                </Text>
                <Text className={`text-xs mt-1 ${msg.isAI ? 'text-gray-400' : 'text-blue-100'}`}>
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <View className="px-6 pb-4">
          <Text className="text-gray-600 text-sm mb-3">Quick prompts:</Text>
          <View className="flex-row space-x-3">
            {quickPrompts.map((prompt, index) => (
              <Pressable
                key={index}
                className={`${prompt.color} rounded-xl px-4 py-3 flex-row items-center flex-1`}
                onPress={() => handleQuickPrompt(prompt.text)}
              >
                {prompt.icon}
                <Text className="text-gray-700 text-sm ml-2 font-medium">{prompt.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View className="bg-white px-6 py-4 shadow-lg">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
          <TextInput
            className="flex-1 text-gray-800 text-base"
            placeholder="Ask me anything about your studies..."
            placeholderTextColor="#9ca3af"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <Pressable
            className={`ml-3 w-8 h-8 rounded-full items-center justify-center ${message.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}