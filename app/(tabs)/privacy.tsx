import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
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
        <Text className="text-white text-3xl font-bold mb-6">Privacy Policy</Text>
        <Text className="text-gray-300 text-base leading-7 mb-5">
          My Daily Therapy stores limited app data needed to support your experience, including intake responses and wellness-related information you choose to provide.
        </Text>
        <Text className="text-gray-300 text-base leading-7 mb-5">
          We do not present this app as emergency support, and you should avoid submitting highly sensitive medical information unless you are comfortable doing so.
        </Text>
        <Text className="text-gray-300 text-base leading-7 mb-5">
          We use Firebase services to store app content and records. Access to data is limited to operating and improving the service.
        </Text>
        <Text className="text-gray-300 text-base leading-7 mb-20">
          For privacy questions or requests, contact support@mydailytherapy.app.
        </Text>
      </ScrollView>
    </View>
  );
}
