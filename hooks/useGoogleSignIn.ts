import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential, getAdditionalUserInfo, type UserCredential } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

const redirectUri = makeRedirectUri({
  scheme: 'mydailytherapy',
  path: 'oauthredirect',
});

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [request, , promptAsync] = Google.useAuthRequest({
    webClientId,
    clientId: webClientId,
    redirectUri,
  });

  const signInWithGoogle = async (): Promise<UserCredential> => {
    if (!webClientId) {
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
    googleReady: !!request && !!webClientId,
  };
}

export function isNewGoogleUser(credential: UserCredential): boolean {
  return getAdditionalUserInfo(credential)?.isNewUser ?? false;
}
