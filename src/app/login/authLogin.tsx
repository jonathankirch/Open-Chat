import axios from 'axios'
import { toast } from 'react-toastify'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '../context/UserContext'

interface LoginProps {
  email: string
  password: string
  remember: boolean
}

const notifySuccess = () => toast.success('Login success!')
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const useLogin = () => {
  const router = useRouter()
  const { setContextToken } = useUserContext()

  const login = useCallback(
    async ({ email, password, remember }: LoginProps) => {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        }
      )

      const saveUser = async (token: string) => {
        if (remember) {
          localStorage.setItem('token', token)
        } else {
          sessionStorage.setItem('token', token)
        }
        setContextToken(token)
      }

      if (response.status === 200) {
        await saveUser(response.data.token)
        notifySuccess()
        router.push('/chat')
      }

      return response
    },
    [router, setContextToken]
  )

  return { login }
}
