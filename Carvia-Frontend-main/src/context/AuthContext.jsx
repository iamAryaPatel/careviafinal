import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const REQUIRED_FIELDS = [
    'full_name',
    'phone',
    'location',
    'education',
    'degree',
    'university',
    'graduation_year',
    'experience_level',
    'skills',
    'preferred_roles',
    'preferred_locations',
    'work_preference',
  ];

  const OPTIONAL_FIELDS = [
    'resume_url',
    'linkedin_url',
    'github_url',
    'portfolio_url',
    'expected_salary',
    'avatar_url',
  ];

  const isProfileComplete = (prof) => {
    if (!prof) return false;
    return REQUIRED_FIELDS.every(
      (field) => prof[field] && String(prof[field]).trim() !== ''
    );
  };

  const calculateProfileCompletion = (prof) => {
    if (!prof) return 0;
    let requiredFilled = 0;
    REQUIRED_FIELDS.forEach((field) => {
      if (prof[field] && String(prof[field]).trim() !== '') {
        requiredFilled++;
      }
    });

    let optionalFilled = 0;
    OPTIONAL_FIELDS.forEach((field) => {
      if (prof[field] && String(prof[field]).trim() !== '') {
        optionalFilled++;
      }
    });

    // 80% assigned to 12 required fields, 20% to 6 optional fields
    const reqPercentage = (requiredFilled / REQUIRED_FIELDS.length) * 80;
    const optPercentage = (optionalFilled / OPTIONAL_FIELDS.length) * 20;

    return Math.min(100, Math.round(reqPercentage + optPercentage));
  };

  const loadProfile = async (u) => {
    if (!u) {
      setProfile(null);
      return;
    }
    setLoadingProfile(true);
    try {
      // 1. Check local storage cache
      const cached = localStorage.getItem(`carvia_profile_${u.id}`);
      let currentProfile = cached ? JSON.parse(cached) : null;

      // 2. Try fetching from Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .maybeSingle();

      if (data) {
        currentProfile = { ...currentProfile, ...data };
      } else if (error) {
        console.warn('Supabase profile fetch error or table pending:', error.message);
      }

      if (!currentProfile) {
        currentProfile = {
          id: u.id,
          full_name: u.user_metadata?.full_name || u.user_metadata?.name || '',
          email: u.email || '',
          created_at: new Date().toISOString(),
        };
      }

      setProfile(currentProfile);
      localStorage.setItem(`carvia_profile_${u.id}`, JSON.stringify(currentProfile));
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadProfile(currentUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          loadProfile(currentUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const formatAuthError = (err) => {
    if (!err) return 'An unexpected error occurred.';
    const msg = typeof err === 'string' ? err : err.message || '';

    if (msg.includes('Invalid login credentials')) {
      return 'Invalid email address or password. Please verify your details.';
    }
    if (msg.includes('User already registered') || msg.includes('already exists')) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (msg.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    if (msg.includes('Email not confirmed')) {
      return 'Please verify your email address to sign in.';
    }
    if (msg.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return msg || 'Authentication failed. Please try again.';
  };

  const signInWithGoogle = async () => {
    const redirectTo = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) throw error;
  };

  const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data?.user) {
      const isConfirmed = data.user.email_confirmed_at || data.user.confirmed_at;
      if (!isConfirmed) {
        await supabase.auth.signOut();
        throw new Error('Email not confirmed');
      }
      await loadProfile(data.user);
    }
    return data;
  };



const signUpWithPassword = async (email, password, options = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      ...options,
      emailRedirectTo: "https://carvia-jobs.vercel.app/auth",
    },
  });

  return { data, error };
};

    if (error) throw error;
    if (data?.user) {
      const initialProfile = {
        id: data.user.id,
        full_name: options?.data?.full_name || '',
        email: email,
        created_at: new Date().toISOString(),
      };
      await saveProfile(initialProfile, data.user.id);
    }
    return data;
  };

  const resetPasswordForEmail = async (email) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  };

  const saveProfile = async (profileData, userId = user?.id) => {
    if (!userId) return null;
    const updated = {
      ...profile,
      ...profileData,
      id: userId,
      updated_at: new Date().toISOString(),
    };

    setProfile(updated);
    localStorage.setItem(`carvia_profile_${userId}`, JSON.stringify(updated));

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updated)
        .select()
        .maybeSingle();

      if (error) {
        console.warn('Supabase profile save notice:', error.message);
      } else if (data) {
        setProfile(data);
        localStorage.setItem(`carvia_profile_${userId}`, JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Profile sync notice:', err);
    }

    return updated;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        loadingProfile,
        isProfileComplete,
        formatAuthError,
        saveProfile,
        calculateProfileCompletion,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        resetPasswordForEmail,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
