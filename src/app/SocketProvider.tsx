// SocketProvider.tsx
'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextProps {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextProps>({ socket: null })

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const socket = io(`${backendUrl}`, { query: { user } })
    socketRef.current = socket

    return () => {
      socket.disconnect() // Desconectar ao desmontar
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}
