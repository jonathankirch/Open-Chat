"use client"

import axios from 'axios'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface AllGroupsProps {
  onSelectGroup: () => void; // Define a prop onSelectGroup
}

export default function AllGroups({ onSelectGroup }: AllGroupsProps) {
  const [groups, setGroups] = useState<any[]>([])
  const [loggedUser, setLoggedUser] = useState<string>('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user') || sessionStorage.getItem('user') ||''
      setLoggedUser(user)
    }
  }, [])

  useEffect(() => {
    async function fetchApi() {
      await axios
        .post(`${backendUrl}/api/users/findGroups`, {
          user: loggedUser,
        }, {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        })
        .then((res) => {
          setGroups(res.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
    fetchApi()
  }, [loggedUser, backendUrl])

  return (
    <>
    {groups.length > 0 ? groups.map((group, index) => (
      <div key={index}>
        <Link href={`/chat/${group.name}?is_group=true`}>
          <div className="border-y py-3 px-5 hover:bg-gray-700 transition" onClick={onSelectGroup}>
            <p>{group.name}</p>
          </div>
        </Link>
      </div>
    )): (<p>No groups</p>)}
  </>
  );
}