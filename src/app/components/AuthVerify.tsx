'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthProps {
  children: React.ReactNode
}

export default function AuthVerify ({children}: AuthProps) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');

    if (!user && !sessionUser) {
      router.push('/login');  
    }
  }, [router]);

  return <>{children}</>;
} 