import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  User,
  AuthError,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';

interface AuthState {
  user: User | null;
  isLoaded: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoaded: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, isLoaded: true });
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await firebaseSignIn(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    return firebaseSignUp(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUser must be used within <AuthProvider>');
  return ctx;
}

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'No account found with this email and password.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return error.message;
  }
}
