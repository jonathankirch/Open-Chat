import axios from 'axios'

interface LoginProps {
  name: string
  password: string
  remember: boolean
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const login = async ({ name, password, remember }: LoginProps) => {
  const response = await axios.post(`${backendUrl}/api/auth/login`, {
    username: name,
    password,
  }, {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  })
  
  const saveUser = () => {
    if (remember) {
      localStorage.setItem('user', name)
    } else {
      sessionStorage.setItem('user', name)
    }
  }

  if (response.status === 200) {
    saveUser()
  }

  return response
}
