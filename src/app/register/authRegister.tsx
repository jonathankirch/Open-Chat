import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface RegisterProps {
  name: string
  email: string
  password: string
  remember: boolean
}

const notifySuccess = () => toast.success('Account created!')
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const useRegister = () => {
  const router = useRouter()

  const register = useCallback(
    async ({ name, email, password, remember }: RegisterProps) => {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          username: name,
          email,
          password,
        },
        {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        }
      )
      const saveUser = (token: string) => {
        if (remember) {
          localStorage.setItem('token', token)
        } else {
          sessionStorage.setItem('token', token)
        }
      }

      if (response.status === 201) {
        saveUser(response.data.token)
        notifySuccess()
        router.push('/chat')
      }

      return response
    },
    [router]
  )

  return { register }
}
