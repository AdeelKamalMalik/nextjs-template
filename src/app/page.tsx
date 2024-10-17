// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils';

export default function HomePage() {
  const token = getAccessToken()
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/blogs');
    } else {
      router.push('/auth/signin');
    }
  }, [router, token]);

  return <p>Redirecting...</p>;
}
