import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { GoogleLogo } from '@/components/GoogleLogo';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useUser, getAuthErrorMessage } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useUser();
  const { signInWithGoogle, googleLoading, googleReady } = useGoogleSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const busy = loading || googleLoading;

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (e: any) {
      if (e?.message === 'Google sign-in was cancelled.') return;
      setError(getAuthErrorMessage(e));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1e1e1e]">
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 pt-16"
      >
        <View className="mb-8">
          <Text className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome Back!</Text>
          <Text className="text-[#a0a0a0] text-lg font-semibold">Login to My Daily Therapy</Text>
        </View>

        {error ? (
          <View className="mb-4 bg-red-900/40 rounded-2xl px-5 py-3">
            <Text className="text-red-400 text-sm font-semibold">{error}</Text>
          </View>
        ) : null}

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
            editable={!busy}
          />
        </View>

        <View className="mb-6">
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8e8e93"
            className="bg-[#2a2a2a] text-white rounded-2xl px-5 py-5 text-base font-semibold"
            style={{ textAlignVertical: 'center' }}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!busy}
          />
        </View>

        <TouchableOpacity
          className={`bg-[#4677b1] rounded-2xl py-4 items-center mb-6 ${busy ? 'opacity-60' : ''}`}
          onPress={handleSignIn}
          disabled={busy}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10">
          <Text className="text-[#a0a0a0] text-base font-semibold">Don't have an account? </Text>
          <TouchableOpacity onPress={handleCreateAccount} disabled={busy}>
            <Text className="text-[#e0e0e0] text-base font-bold">Create Account</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-10">
          <View className="flex-1 h-[1px] bg-[#3a3a3c]" />
          <Text className="text-[#8e8e93] px-4 font-bold text-xs tracking-wider">OR</Text>
          <View className="flex-1 h-[1px] bg-[#3a3a3c]" />
        </View>

        <TouchableOpacity
          className={`bg-white rounded-2xl py-4 flex-row items-center justify-center mb-10 ${busy || !googleReady ? 'opacity-60' : ''}`}
          onPress={handleGoogleSignIn}
          disabled={busy || !googleReady}
        >
          {googleLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              <View className="mr-3">
                <GoogleLogo width={22} height={22} />
              </View>
              <Text className="text-black text-lg font-extrabold">Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View className="mt-auto items-center mb-4">
          <Text className="text-[#8e8e93] text-sm font-bold">Medical Disclaimer</Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
