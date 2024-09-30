'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function NewFriend() {
  const [message, setMessage] = useState('')
  const [receiver, setReceiver] = useState('')
  const [loggedUser, setLoggedUser] = useState<string>('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user =
        localStorage.getItem('token') || sessionStorage.getItem('token') || ''
      setLoggedUser(user)
    }
  }, [])
  async function fetchApi() {
    try {
      const response = await axios.post(
        `${backendUrl}/api/friend-request/send`,
        {
          sender: loggedUser,
          receiver,
        },
        {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        }
      )
      setMessage(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data || error.message)
      } else {
        setMessage('An unexpected error occurred.')
        console.error('Unexpected error:', error)
      }
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setReceiver(event.target.value)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      fetchApi()
    }
  }

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold mb-5 mt-10">New Friend:</h1>
      <input
        className="bg-gray-700 rounded pl-1"
        type="text"
        placeholder="Name: "
        value={receiver}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={fetchApi}
        className="text-green-600 rounded px-2 border border-green-600 ml-2 hover:text-green-400 hover:border-green-400 transition">
        Add
      </button>

      <p className="mt-5">{message}</p>
    </div>
  )
}
