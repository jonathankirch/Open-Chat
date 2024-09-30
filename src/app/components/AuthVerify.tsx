'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { useUserContext } from '../context/UserContext'
import { headers } from 'next/headers'

interface AuthProps {
  children: React.ReactNode
}

export default function AuthVerify({ children }: AuthProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { contextToken, setContextToken } = useUserContext()
  const [token, setToken] = useState<string | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(
        localStorage.getItem('token') || sessionStorage.getItem('token') || ''
      )
    }
  }, [])

  useEffect(() => {
    const noAuthRequiredRoutes = ['/login', '/register']

    async function fetchApi() {
      if (token || contextToken) {
        try {
          const res = await axios.post(
            `${backendUrl}/api/auth/verify`,
            {
              token: token || contextToken,
            },
            {
              headers: {
                'bypass-tunnel-reminder': '1',
              },
            }
          )
          console.log('status da requisicao de auth verify: ', res.status)
          if (res.status === 200) {
            if (localStorage.getItem('token') !== null) {
              localStorage.setItem('user', res.data.user)
            } else {
              sessionStorage.setItem('user', res.data.user)
            }
            if (pathname === '/login' || pathname === '/register') {
              router.push('/chat')
            }
            router.push(pathname)
          } else if (res.status === 400) {
            setContextToken(null)
            router.push('/login')
          }
        } catch (error) {
          console.log(error)
          setContextToken(null)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    if (!noAuthRequiredRoutes.includes(pathname)) {
      fetchApi()
    }
  }, [backendUrl, router, contextToken, pathname, setContextToken, token])

  return <>{children}</>
}
