'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Sync user to MongoDB backend
      if (firebaseUser) {
        try {
          await api.post('/api/auth/sync', {
            photoURL: firebaseUser.photoURL,
          });
        } catch (err) {
          console.error('Failed to sync user:', err);
        }
      }
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to ensure fresh tokens
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/configuration-not-found') {
        alert('Firebase Error: CONFIGURATION_NOT_FOUND. Please ensure Google Sign-In is enabled in your Firebase Console and the Identity Toolkit API is active.');
      } else {
        alert('Sign-in failed: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
