'use client'

import axios from 'axios'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface ContactsProps {
  username: string
}

interface AllContactsProps {
  onSelectContact: () => void
}

export default function AllContacts({ onSelectContact }: AllContactsProps) {
  const [contacts, setContacts] = useState<ContactsProps[]>([])
  const [loggedUser, setLoggedUser] = useState<string>('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user =
        localStorage.getItem('token') || sessionStorage.getItem('token') || ''
      setLoggedUser(user)
    }
  }, [loggedUser])

  useEffect(() => {
    async function fetchApi() {
      await axios
        .post(
          `${backendUrl}/api/users/findContacts`,
          {
            token: loggedUser,
          },
          {
            headers: {
              'bypass-tunnel-reminder': '1',
            },
          }
        )
        .then((res) => {
          setContacts(res.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
    fetchApi()
  }, [loggedUser, backendUrl])

  return (
    <>
      {contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <div key={index}>
            <Link href={`/chat/${contact.username}?is_group=false`}>
              <div
                className="border-y py-3 px-5 hover:bg-gray-700 transition"
                onClick={onSelectContact}>
                <p>{contact.username}</p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p>No contacts</p>
      )}
    </>
  )
}
