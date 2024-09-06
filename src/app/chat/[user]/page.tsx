'use client'

import Messages from '../../components/Messages'
import { useState } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { IoSend } from 'react-icons/io5'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function User({ params }: { params: { user: string } }) {
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const isGroupParam = searchParams.get('is_group')
  const isGroup = isGroupParam === 'true'

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const sendMessage = async () => {
    if (message.trim() === '') return

    try {
      await axios.post(`${backendUrl}/api/messages/create`, {
        sender: localStorage.getItem('user'),
        receiver: decodeURIComponent(params.user),
        message: message,
        isGroup
      })
      setMessage('') // Clear the message after sending
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div>
      <header className='text-4xl flex bg-gray-800 mb-3 p-5'>
        <button onClick={() => router.back()}>
          <IoMdArrowRoundBack className='my-auto mt-1 mr-2' />
        </button>
        <h1>{decodeURIComponent(params.user)}</h1>
      </header>
      <div>
        <Messages user={decodeURIComponent(params.user)} isGroup={isGroup} />
      </div>
      <div className="fixed bottom-0 p-4 bg-gray-900 border-t border-gray-700 md:w-3/4 w-full ml-auto flex items-center">
        <input
          id="inputMessage"
          className="rounded bg-gray-800 py-2 px-4 flex-grow focus:outline-none"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message: "
        />
        <button
          className="bg-green-500 px-3 rounded ml-3 py-2 hover:bg-green-600 transition"
          onClick={sendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  )
}