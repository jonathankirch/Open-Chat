'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AllContacts from '../components/AllContacts'
import UAParser from 'ua-parser-js'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedChat, setSelectedChat] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const isGroupParam = searchParams.get('is_group')
  const isGroup = isGroupParam === 'true'

  useEffect(() => {
    const parser = new UAParser()
    const result = parser.getResult()
    setIsMobile(
      result.device.type === 'mobile' || result.device.type === 'tablet'
    )
  }, [])

  useEffect(() => {
    const userParam = searchParams.get('user')
    if (userParam || isGroupParam) {
      setSelectedChat(true)
    } else {
      setSelectedChat(false)
    }
  }, [searchParams, isGroupParam])

  return (
    <>
    {/* <AuthVerify> */}
        <div className="h-full">
          {isMobile ? (
            <div className="h-full">
              {selectedChat ? (
                <section className="bg-gray-700 h-full">{children}</section>
              ) : (
                <section className="p-5 bg-gray-800 border-r border-gray-100 flex flex-col h-full">
                  <p className="mb-5 text-xl font-bold">Contacts:</p>
                  <div className="flex-grow">
                    <AllContacts
                      onSelectContact={() => setSelectedChat(true)}
                    />
                  </div>
                  {/* <p className="mb-5 text-xl font-bold">Groups:</p>
                <div className="flex-grow">
                  <AllGroups onSelectGroup={() => setSelectedChat(true)} />
                </div> */}
                </section>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 h-full">
              <section className="col-span-1 p-5 bg-gray-800 border-r border-gray-100 flex flex-col h-full">
                <p className="mb-5 text-xl font-bold">Contacts:</p>
                <div className="flex-grow">
                  <AllContacts onSelectContact={() => setSelectedChat(true)} />
                </div>
                {/* <p className="mb-5 text-xl font-bold">Groups:</p>
              <div className="flex-grow">
                <AllGroups onSelectGroup={() => setSelectedChat(true)} />
              </div> */}
              </section>
              <section className="col-span-3 bg-gray-700 h-full">
                {children}
              </section>
            </div>
          )}
        </div>
    {/* </AuthVerify> */}
    </>

  )
}
