import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<any>;
  registerWithEmail: (email: string, password: string, extra: Partial<User>) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (details: Partial<User>) => Promise<boolean>;
  setSession: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cropcare_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cropcare_token');
  });
  const [loading, setLoading] = useState(true);

  // Sync token and user changes with localStorage
  useEffect(() => {
    console.log("TOKEN CHANGED:", token);
    if (token) {
      localStorage.setItem('cropcare_token', token);
    } else {
      localStorage.removeItem('cropcare_token');
    }
  }, [token]);

  useEffect(() => {
    console.log("USER CHANGED:", user);
    if (user) {
      localStorage.setItem('cropcare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cropcare_user');
    }
  }, [user]);

  const setSession = (newToken: string, newUser: User) => {
    console.log("SET SESSION CALLED");
    console.log(newToken);
    console.log(newUser);

    localStorage.setItem("cropcare_token", newToken);
    localStorage.setItem("cropcare_user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  };
  // Authenticate and sync with backend for Google Firebase Auth
  // Authenticate and sync with backend for Google Firebase Auth
  const syncFirebaseUser = async (firebaseUser: FirebaseUser) => {
    try {
      const provider = firebaseUser.providerData[0];

      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email || provider?.email,
          name: firebaseUser.displayName || provider?.displayName,
        }),
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Google authentication failed");
      }

      // Save session
      setToken(data.token);
      setUser(data.user);

      console.log("Token saved:", data.token);
      console.log("User saved:", data.user);

      return data.user;

    } catch (error) {
      console.error("Google sync error:", error);
      throw error;
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await syncFirebaseUser(firebaseUser);
        }
      } catch (error) {
        console.error("Auth state error:", error);
      } finally {
        // Always stop the loading spinner
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, extra: Partial<User>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      // DO NOT set active user/token here immediately, return data first.
      // The user must enter the OTP on the registration page before the session is saved.
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      return await syncFirebaseUser(result.user);
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (details: Partial<User>) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(details),
      });
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, ...details } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithEmail, registerWithEmail, loginWithGoogle, logout, updateProfile, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
