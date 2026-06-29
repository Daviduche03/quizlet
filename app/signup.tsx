import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { GoogleLogo } from '@/components/GoogleLogo';
import { useGoogleSignIn, isNewGoogleUser } from '@/hooks/useGoogleSignIn';
import { useUser, getAuthErrorMessage } from '@/lib/auth';
import { saveProfile } from '@/lib/profile';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useUser();
  const { signInWithGoogle, googleLoading, googleReady } = useGoogleSignIn();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const busy = loading || googleLoading;

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

  const handleGoogleSignUp = async () => {
    setError('');
    try {
      const cred = await signInWithGoogle();
      if (isNewGoogleUser(cred)) {
        await saveProfile(cred.user.uid, {
          name: cred.user.displayName ?? '',
          email: cred.user.email ?? '',
        });
      }
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
            editable={!busy}
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
            editable={!busy}
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
            editable={!busy}
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
            editable={!busy}
          />
        </View>

        <TouchableOpacity
          className={`bg-[#4677b1] rounded-2xl py-4 items-center mb-6 ${busy ? 'opacity-60' : ''}`}
          onPress={handleSignUp}
          disabled={busy}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-10">
          <Text className="text-[#a0a0a0] text-base font-semibold">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')} disabled={busy}>
            <Text className="text-[#e0e0e0] text-base font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-10">
          <View className="flex-1 h-[1px] bg-[#3a3a3c]" />
          <Text className="text-[#8e8e93] px-4 font-bold text-xs tracking-wider">OR</Text>
          <View className="flex-1 h-[1px] bg-[#3a3a3c]" />
        </View>

        <TouchableOpacity
          className={`bg-white rounded-2xl py-4 flex-row items-center justify-center mb-10 ${busy || !googleReady ? 'opacity-60' : ''}`}
          onPress={handleGoogleSignUp}
          disabled={busy || !googleReady}
        >
          {googleLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              <View className="mr-3">
                <GoogleLogo width={22} height={22} />
              </View>
              <Text className="text-black text-lg font-extrabold">Sign up with Google</Text>
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
