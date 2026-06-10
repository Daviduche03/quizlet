import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useUser, getAuthErrorMessage } from '@/lib/auth';

const GoogleLogo = ({ width = 20, height = 20 }) => (
  <Svg width={width} height={height} viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleGoogleSignIn = () => {
    Alert.alert('Coming Soon', 'Google sign-in is not yet available.');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Coming Soon', 'Apple sign-in is not yet available.');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1e1e1e]">
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-8 mt-12">
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
            editable={!loading}
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
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          className={`bg-[#4677b1] rounded-2xl py-4 items-center mb-6 ${loading ? 'opacity-60' : ''}`}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10">
          <Text className="text-[#a0a0a0] text-base font-semibold">Don't have an account? </Text>
          <TouchableOpacity onPress={handleCreateAccount} disabled={loading}>
            <Text className="text-[#e0e0e0] text-base font-bold">Create Account</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-10">
          <View className="flex-1 h-[1px] bg-[#3a3a3c]" />
          <Text className="text-[#8e8e93] px-4 font-bold text-xs tracking-wider">OR</Text>
          <View className="flex-1 h-[1px] bg-[#3a3a3c]" />
        </View>

        <TouchableOpacity
          className="bg-white rounded-2xl py-4 flex-row items-center justify-center mb-4"
          onPress={handleAppleSignIn}
          disabled={loading}
        >
          <FontAwesome name="apple" size={22} color="black" style={{ marginRight: 10, marginBottom: 2 }} />
          <Text className="text-black text-lg font-extrabold">Sign in with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl py-4 flex-row items-center justify-center mb-10"
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <View className="mr-3">
            <GoogleLogo width={22} height={22} />
          </View>
          <Text className="text-black text-lg font-extrabold">Sign in with Google</Text>
        </TouchableOpacity>

        <View className="mt-auto items-center mb-4">
          <Text className="text-[#8e8e93] text-sm font-bold">Medical Disclaimer</Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
