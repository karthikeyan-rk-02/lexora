import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase/config.ts';
import { UserProfile } from '../types/index.ts';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateDisplayNameProfile: (newName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync / create user profile document in Firestore
  const syncUserProfile = async (user: User, fallbackName?: string) => {
    const userRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile({
          uid: user.uid,
          fullName: data.fullName || user.displayName || fallbackName || 'Lexora Member',
          email: user.email || data.email || '',
          photoURL: user.photoURL || data.photoURL || null,
          createdAt: data.createdAt,
        });
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          fullName: user.displayName || fallbackName || 'Lexora Member',
          email: user.email || '',
          photoURL: user.photoURL || null,
        };
        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
        });
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Error fetching/saving user profile:', err);
      // Fallback local profile so user can still see dashboard UI
      setUserProfile({
        uid: user.uid,
        fullName: user.displayName || fallbackName || 'Lexora Member',
        email: user.email || '',
        photoURL: user.photoURL || null,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    } catch (error: any) {
      // Don't treat user-closed popup as fatal error
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, fullName: string) => {
    const trimmedName = fullName.trim() || 'Lexora Member';
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      // Update Firebase Auth display name
      await updateProfile(result.user, { displayName: trimmedName });
      // Create user document in Firestore through syncUserProfile
      await syncUserProfile(result.user, trimmedName);

      // Send verification email safely
      try {
        await sendEmailVerification(result.user);
      } catch (e) {
        console.warn('Could not send verification email:', e);
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await syncUserProfile(result.user);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateDisplayNameProfile = async (newName: string) => {
    if (!currentUser) return;
    const trimmed = newName.trim();
    if (!trimmed) throw new Error('Name cannot be empty.');

    // 1. Update Firebase Auth displayName
    await updateProfile(currentUser, { displayName: trimmed });

    // 2. Update Firestore document
    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userRef, {
        fullName: trimmed,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }

    // 3. Update local state
    setUserProfile((prev) => (prev ? { ...prev, fullName: trimmed } : null));
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        sendPasswordReset,
        updateDisplayNameProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
