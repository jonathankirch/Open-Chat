'use client'
// Função para pegar as mensagens da conversa
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

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
  const [storedUser, setStoredUser] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [oldLengthMessages, setOldLengthMessages] = useState(0)

  const socketRef = useRef<any>(null) // Referência ao socket

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    // Iniciar a conexão com o Socket.io
    const socket = io('http://localhost:5000')
    socketRef.current = socket

    // Ouvir mensagens recebidas
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage])
    })

    return () => {
      socket.disconnect() // Desconectar o socket ao desmontar o componente
    }
  }, [])

  useEffect(() => {
    setStoredUser(
      localStorage.getItem('user') || sessionStorage.getItem('user') || ''
    )

    async function fetchApi() {
      const usersArray = [user, storedUser]

      let url = ''
      let data = {}

      if (isGroup) {
        url = `${backendUrl}/api/messages/groupMessages`
        data = { groupName: user, user: storedUser } // ajuste aqui para enviar os dados corretos
      } else {
        url = `${backendUrl}/api/messages/findByUsers`
        data = { users: usersArray } // ajuste aqui para enviar os dados corretos
      }

      await axios
        .post(url, data, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((res) => {
          setMessages(res.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          setErrorMessage(error.response.data.msg)
        })
    }

    fetchApi()
  }, [backendUrl, isGroup, storedUser, user])

  useEffect(() => {
    // Verifique se o comprimento das mensagens mudou e role para baixo
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
                message.sender === storedUser
                  ? 'ml-auto bg-gray-400 text-black rounded-l'
                  : ' rounded-r'
              }`}>
              {isGroup ? (
                <span>
                  {message.sender !== storedUser && (
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
