import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SocketProvider } from './SocketProvider'
import AuthVerify from './components/AuthVerify'
import { UserProvider } from './context/UserContext'

export const metadata: Metadata = {
  title: 'Open Chat',
  description: 'The chat for send messages for your friends!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className="text-white h-screen flex flex-col">
        <Header />
        <UserProvider>
          <AuthVerify>
            <SocketProvider>
              <main className="flex-grow">
                <ToastContainer
                  toastStyle={{ backgroundColor: 'black', color: 'white' }}
                  progressStyle={{ backgroundColor: 'transparent' }}
                  className="top-right"
                />
                {children}
              </main>
            </SocketProvider>
          </AuthVerify>
        </UserProvider>
      </body>
    </html>
  )
}
