import { useState } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, getAdditionalUserInfo, type UserCredential } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

const getGoogleReverseScheme = (clientId: string) => {
  const id = clientId.replace('.apps.googleusercontent.com', '');
  return `com.googleusercontent.apps.${id}`;
};

const getRedirectUri = (clientId: string) =>
  `${getGoogleReverseScheme(clientId)}:/oauthredirect`;

const isGoogleConfigured = () => {
  if (!webClientId) return false;
  if (Platform.OS === 'android') return !!androidClientId;
  if (Platform.OS === 'ios') return !!(iosClientId ?? webClientId);
  return true;
};

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const platformClientId = Platform.OS === 'android' ? androidClientId : (iosClientId ?? webClientId);
  const redirectUri = platformClientId ? getRedirectUri(platformClientId) : undefined;

  const [request, , promptAsync] = Google.useAuthRequest(
    {
      webClientId,
      androidClientId,
      iosClientId,
      clientId: Platform.OS === 'android' ? androidClientId : undefined,
      redirectUri,
    },
    {},
  );

  const signInWithGoogle = async (): Promise<UserCredential> => {
    if (!isGoogleConfigured()) {
      throw new Error('Google sign-in is not configured.');
    }
    if (!request) {
      throw new Error('Google sign-in is not ready yet.');
    }

    setLoading(true);
    try {
      const result = await promptAsync();
      if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Google sign-in was cancelled.');
      }
      if (result.type !== 'success') {
        throw new Error('Google sign-in failed.');
      }

      const idToken = result.authentication?.idToken ?? result.params?.id_token;
      if (!idToken) {
        throw new Error('No ID token received from Google.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      return signInWithCredential(auth, credential);
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    googleLoading: loading,
    googleReady: !!request && isGoogleConfigured(),
  };
}

export function isNewGoogleUser(credential: UserCredential): boolean {
  return getAdditionalUserInfo(credential)?.isNewUser ?? false;
}
