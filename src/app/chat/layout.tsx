'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation' // Hook para acessar os parâmetros da URL
import AllContacts from '../components/AllContacts'
import AllGroups from '../components/AllGroups'
import AuthProps from '../components/AuthVerify'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedChat, setSelectedChat] = useState<boolean>(false)
  const searchParams = useSearchParams() // Hook para acessar os parâmetros da URL
  const isGroupParam = searchParams.get('is_group') // Obtém o valor de 'is_group' na URL
  const isGroup = isGroupParam === 'true'

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = `${backendUrl}/api/friend-request/pending/`
  console.log(url)

  // Verificar se está em um dispositivo móvel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Atualiza o estado `selectedChat` com base na presença de `user` na URL
  useEffect(() => {
    const userParam = searchParams.get('user')
    if (userParam || isGroupParam) {
      setSelectedChat(true)
    } else {
      setSelectedChat(false)
    }
  }, [searchParams, isGroupParam]) // Escuta mudanças nos parâmetros da URL

  return (
    <AuthProps>
      <div className="h-full">
        {isMobile ? (
          <div className="h-full">
            {selectedChat ? (
              // Exibe a parte das mensagens no celular quando um chat está selecionado
              <section className="bg-gray-700 h-full">
                {children}
              </section>
            ) : (
              // Exibe a lista de contatos no celular quando nenhum chat está selecionado
              <section className="p-5 bg-gray-800 border-r border-gray-100 flex flex-col h-full">
                <p className="mb-5 text-xl font-bold">Contacts:</p>
                <div className="flex-grow">
                  <AllContacts onSelectContact={() => setSelectedChat(true)} />
                </div>
                <p className="mb-5 text-xl font-bold">Groups:</p>
                <div className="flex-grow">
                  <AllGroups onSelectGroup={() => setSelectedChat(true)} />
                </div>
              </section>
            )}
          </div>
        ) : (
          // Layout para telas maiores (desktop, tablet)
          <div className="grid grid-cols-4 h-full">
            <section className="col-span-1 p-5 bg-gray-800 border-r border-gray-100 flex flex-col h-full">
              <p className="mb-5 text-xl font-bold">Contacts:</p>
              <div className="flex-grow">
                <AllContacts onSelectContact={() => setSelectedChat(true)} />
              </div>
              <p className="mb-5 text-xl font-bold">Groups:</p>
              <div className="flex-grow">
                <AllGroups onSelectGroup={() => setSelectedChat(true)} />
              </div>
            </section>
            <section className="col-span-3 bg-gray-700 h-full">
              {children}
            </section>
          </div>
        )}
      </div>
    </AuthProps>
  )
}
