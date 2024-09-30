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
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Garantir que o código só rode no lado do cliente
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || sessionStorage.getItem('token'))
    }
  }, [])

  useEffect(() => {
    if (!token) {
      console.error('Token não encontrado.')
      return
    }

    if (socketRef.current) {
      console.log('Socket já conectado')
      return
    }

    const socket = io(`${backendUrl}`, {
      auth: { token },
      transports: ['websocket'],
      extraHeaders: {
        'bypass-tunnel-reminder': '1'
      }
    });
    
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
      socket.disconnect();
    };
  }, [token])

  console.log('Socket conectado?', isSocketConnected)

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}
