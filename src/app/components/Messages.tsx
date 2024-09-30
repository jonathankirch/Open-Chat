'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSocket } from '@/app/SocketProvider' // Importa o provider criado

interface PropsMessage {
  user: string
  isGroup: boolean
}

interface MessageProps {
  sender: string
  content: string
}

export default function Messages({ user, isGroup }: PropsMessage) {
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [storedToken, setStoredToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [localStorageUser, setLocalStorageUser] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [oldLengthMessages, setOldLengthMessages] = useState(0)

  const { socket } = useSocket() // Usa o socket do contexto

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    setStoredToken(
      localStorage.getItem('token') || sessionStorage.getItem('token') || ''
    )

    setLocalStorageUser(
      localStorage.getItem('user') || sessionStorage.getItem('user') || ''
    )

    async function fetchApi() {
      let url = ''
      let data = {}

      if (isGroup) {
        url = `${backendUrl}/api/messages/groupMessages`
        data = { groupName: user, user: storedToken }
      } else {
        url = `${backendUrl}/api/messages/findByUsers`
        data = { user1: storedToken, user2: user }
      }

      await axios
        .post(url, data, {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        })
        .then((res) => {
          setMessages(res.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          setErrorMessage(error.response.data.msg || 'Error fetching data')
        })
    }

    fetchApi()
  }, [backendUrl, isGroup, user, storedToken])

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (newMessage) => {
        if (
          newMessage.sender === localStorageUser ||
          newMessage.sender === user
        ) {
          setMessages((prevMessages) => [...prevMessages, newMessage])
          console.log('Nova mensagem recebida pelo socket:', newMessage)
          console.log('user localStorage: ', localStorageUser)
        }
        console.log('New Message:', newMessage)
      })

      return () => {
        socket.off('receiveMessage') // Limpar o listener
      }
    }
  }, [socket, user, storedToken, localStorageUser])

  useEffect(() => {
    if (messages.length !== oldLengthMessages) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
      setOldLengthMessages(messages.length)
    }
  }, [messages, oldLengthMessages])

  return (
    <div className="flex flex-col h-96 2xl:h-[39rem]">
      <ul className="w-full flex-1 overflow-y-scroll">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li
              key={index}
              className={`py-2 ml-2 px-3 break-words border md:max-w-xl max-w-[calc(100%/2)] my-3 ${
                message.sender === localStorageUser
                  ? 'ml-auto bg-gray-400 text-black rounded-l'
                  : ' rounded-r'
              }`}>
              {isGroup ? (
                <span>
                  {message.sender !== localStorageUser && (
                    <>
                      <span className="font-bold">{message.sender}: </span>
                      <br />
                    </>
                  )}
                  {message.content}
                </span>
              ) : (
                <span>{message.content}</span>
              )}
            </li>
          ))
        ) : (
          <li className="text-center mt-24 text-4xl font-bold text-gray-400">
            Conversa vazia
          </li>
        )}

        <div ref={messagesEndRef} />
      </ul>
    </div>
  )
}
