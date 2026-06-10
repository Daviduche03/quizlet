import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useUser, getAuthErrorMessage } from '@/lib/auth';
import { saveProfile } from '@/lib/profile';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const cred = await signUp(email.trim(), password);
      await saveProfile(cred.user.uid, { name: name.trim(), email: email.trim() });
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1e1e1e]">
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-8 mt-12">
          <Text className="text-4xl font-extrabold text-white mb-2 tracking-tight">Create Account</Text>
          <Text className="text-[#a0a0a0] text-lg font-semibold">Join My Daily Therapy</Text>
        </View>

        {error ? (
          <View className="mb-4 bg-red-900/40 rounded-2xl px-5 py-3">
            <Text className="text-red-400 text-sm font-semibold">{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#8e8e93"
            className="bg-[#2a2a2a] text-white rounded-2xl px-5 py-5 text-base font-semibold"
            style={{ textAlignVertical: 'center' }}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        <View className="mb-4">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#8e8e93"
            className="bg-[#2a2a2a] text-white rounded-2xl px-5 py-5 text-base font-semibold"
            style={{ textAlignVertical: 'center' }}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View className="mb-4">
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8e8e93"
            className="bg-[#2a2a2a] text-white rounded-2xl px-5 py-5 text-base font-semibold"
            style={{ textAlignVertical: 'center' }}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <View className="mb-6">
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#8e8e93"
            className="bg-[#2a2a2a] text-white rounded-2xl px-5 py-5 text-base font-semibold"
            style={{ textAlignVertical: 'center' }}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          className={`bg-[#4677b1] rounded-2xl py-4 items-center mb-6 ${loading ? 'opacity-60' : ''}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10">
          <Text className="text-[#a0a0a0] text-base font-semibold">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')} disabled={loading}>
            <Text className="text-[#e0e0e0] text-base font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-auto items-center mb-4">
          <Text className="text-[#8e8e93] text-sm font-bold">Medical Disclaimer</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
