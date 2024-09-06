import axios from 'axios'

interface RegisterProps {
  name: string
  email: string
  password: string
  remember: boolean
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const register = async ({ name, email, password, remember }: RegisterProps) => {
  const response = await axios.post(`${backendUrl}/api/auth/register`, {
    username: name,
    email,
    password,
  })
  const saveUser = () => {
    if (remember) {
      localStorage.setItem('user', name)
    } else {
      sessionStorage.setItem('user', name)
    }
  }

  if (response.status === 201) {
    saveUser()
  }

  return response
}
