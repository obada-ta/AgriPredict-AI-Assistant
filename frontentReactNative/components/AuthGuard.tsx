// components/AuthGuard.tsx
import { useAuthStore } from '@/stores/authstore';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  // لا حاجة لـ isLoading لأن persist يُعيد الحالة فورًا من الذاكرة
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return children;
}