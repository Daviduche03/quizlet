import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#1c1c1e]">
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center px-6 pb-6"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#2c2c2e] items-center justify-center"
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-3xl font-bold mb-6">Terms of Use</Text>
        <Text className="text-gray-300 text-base leading-7 mb-5">
          My Daily Therapy provides self-guided wellness content for informational purposes only. It is not a replacement for medical care, diagnosis, or treatment.
        </Text>
        <Text className="text-gray-300 text-base leading-7 mb-5">
          By using the app, you agree to use the content responsibly and to seek help from a qualified professional if you are in crisis or need medical support.
        </Text>
        <Text className="text-gray-300 text-base leading-7 mb-5">
          We may update app content and features over time. Continued use of the app after changes means you accept the updated terms.
        </Text>
        <Text className="text-gray-300 text-base leading-7 mb-20">
          If you have questions about these terms, contact us at support@mydailytherapy.app.
        </Text>
      </ScrollView>
    </View>
  );
}
