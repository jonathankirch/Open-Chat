'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface FriendRequestProps {
  sender: string
  _id: string
}

export default function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<FriendRequestProps[]>([])
  const [storedUser, setStoredUser] = useState('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user =
        localStorage.getItem('token') || sessionStorage.getItem('token  ') || ''
      setStoredUser(user)
    }
  }, [])

  useEffect(() => {
    if (storedUser !== '' || storedUser !== undefined) {
      fetchApi()
    }
    async function fetchApi() {
      await axios
        .get(`${backendUrl}/api/friend-request/pending/${storedUser}`, {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        })
        .then((res) => {
          setFriendRequests(res.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }, [storedUser, backendUrl])

  async function recuseRequest(request: FriendRequestProps) {
    try {
      await axios.post(
        `${backendUrl}/api/friend-request/accept`,
        {
          requestId: request._id,
          response: 'decline',
        },
        {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        }
      )

      // Atualizar a lista de solicitações
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== request._id)
      )

      console.log('Requisição recusada')
    } catch (error) {
      console.error('Erro ao recusar a solicitação:', error)
    }
  }

  async function acceptRequest(request: FriendRequestProps) {
    try {
      await axios.post(
        `${backendUrl}/api/friend-request/accept`,
        {
          requestId: request._id,
          response: 'accepted',
        },
        {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        }
      )

      // Atualizar a lista de solicitações
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== request._id)
      )
      axios.post(
        `${backendUrl}/api/conversations/create`,
        {
          // participantNames: [request.sender, storedUser],
          user: storedUser,
          otherParticipants: [request.sender],
        },
        {
          headers: {
            'bypass-tunnel-reminder': '1',
          },
        }
      )
      console.log('Requisição aceita')
    } catch (error) {
      console.error('Erro ao aceitar a solicitação:', error)
    }
  }

  return (
    <>
      {friendRequests.length >= 1 ? (
        friendRequests.map((request, index) => (
          <li
            className="rounded border bg-gray-700 text-center w-1/6"
            key={index}>
            {request.sender} |{' '}
            <button
              onClick={() => recuseRequest(request)}
              className="text-red-600 hover:text-red-400 transition">
              Cancel
            </button>{' '}
            <button
              onClick={() => acceptRequest(request)}
              className="text-green-600 hover:text-green-400 transition">
              Accept
            </button>
          </li>
        ))
      ) : (
        <p className="text-gray-400">No friend requests</p>
      )}
    </>
  )
}
