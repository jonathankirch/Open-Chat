'use client'

import axios from 'axios'
import { useState, useEffect } from 'react'

interface FriendRequestProps {
  receiver: string
  status: string
}
export default function YourRequests() {
  const [requests, setRequests] = useState<FriendRequestProps[]>([])
  const [storedUser, setStoredUser] = useState('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user') || sessionStorage.getItem('user') || ''
      setStoredUser(user)
    }
  }, [])

  useEffect(() => {
    async function fetchApi() {
      await axios
        .get(`${backendUrl}/api/friend-request/sent/${storedUser}`, {
          headers: {
            'bypass-tunnel-reminder': 'true'
          }
        })
        .then((res) => {
          setRequests(res.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }

    fetchApi()
  }, [storedUser, backendUrl])

  return (
    <>
      {requests.length >= 1 ? (
        requests.map((request, index) => (
          <li key={index} className="text-gray-400">
            {request.receiver} -{' '}
            <strong className='font-normal' style={{ color: getStatusColor(request.status) }}>
              {request.status}
            </strong>
          </li>
        ))
      ) : (
        <li className="text-gray-400">No requests</li>
      )}
    </>
  )

  function getStatusColor(status: FriendRequestProps['status']): string {
    switch (status) {
      case 'accepted':
        return '#16a34a'
      case 'pending':
        return '#fde047'
      case 'declined':
        return '#dc2626'
      default:
        return '#9ca3af'
    }
  }
}
