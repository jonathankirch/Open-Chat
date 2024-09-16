// SocketProvider.tsx
'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextProps {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextProps>({ socket: null })

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')

    // Criar o socket apenas uma vez
    const socket = io(`${backendUrl}`, { query: { user } })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Conectado ao servidor de WebSocket')
      setIsSocketConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Desconectado do servidor de WebSocket')
      setIsSocketConnected(false)
    })

    return () => {
      // Desconectar o socket ao desmontar o componente
      socket.disconnect()
    }
  }, [])

  console.log('Socket conectado?', isSocketConnected)

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}
