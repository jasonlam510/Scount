import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/zustand/userStore';

// Auth data interface following Supabase docs pattern
export type AuthData = {
  session?: Session | null;
  profile?: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
};

// Auth context
export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get Zustand store actions
  const { 
    setCurrentUserUuid, 
    setAccessToken, 
    setRefreshToken, 
    setUserEmail,
    logout: logoutFromStore 
  } = useUserStore();

  // Computed values
  const isLoggedIn = !!(session && profile);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          return;
        }

        setSession(session);
        setProfile(session?.user ?? null);
        
        // Sync with Zustand store
        if (session?.user) {
          setCurrentUserUuid(session.user.id);
          setAccessToken(session.access_token);
          setRefreshToken(session.refresh_token);
          setUserEmail(session.user.email || null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Handle magic link authentication
    const handleMagicLinkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Magic link auth error:', error);
          return;
        }
        
        if (data.session) {
          console.log('Magic link authentication successful');
          // The auth state change listener will handle the rest
        }
      } catch (error) {
        console.error('Magic link auth error:', error);
      }
    };

    // Check for magic link on app start
    handleMagicLinkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setProfile(session?.user ?? null);
        
        if (session?.user) {
          // User signed in - sync with Zustand
          setCurrentUserUuid(session.user.id);
          setAccessToken(session.access_token);
          setRefreshToken(session.refresh_token);
          setUserEmail(session.user.email || null);
        } else {
          // User signed out - clear Zustand store
          logoutFromStore();
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUserUuid, setAccessToken, setRefreshToken, setUserEmail, logoutFromStore]);

  const value: AuthData = {
    session,
    profile,
    isLoading,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
