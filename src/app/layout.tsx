"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useEffect } from 'react';
import '../styles/global.css';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/common/Header';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const token = getAccessToken()
  const router = useRouter();


  useEffect(() => {
    if (token) {
      router.push('/blogs');
    } else {
      router.push('/auth/signin');
    }
  }, [router, token]);
  
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
