'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the ID token and set it as a cookie
        const token = await getIdToken(user, true);
        Cookies.set('auth', token, { expires: 7 }); // Expires in 7 days
      } else {
        // Remove the auth cookie when signed out
        Cookies.remove('auth');
      }

      setUser(user);
      setLoading(false);

      // Redirect based on auth state
      if (!user && window.location.pathname.startsWith('/app')) {
        router.push('/login');
      } else if (user && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
        router.push('/app');
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, router]);

  return <>{children}</>;
} 