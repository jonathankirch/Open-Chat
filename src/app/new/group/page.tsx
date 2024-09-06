'use client'

import axios from 'axios'
import { useState } from 'react'

interface UserProps {
  user: string
}

export default function NewGroup() {
  const [users, setUsers] = useState<string[]>([])
  const [newUser, setNewUser] = useState<string>('')
  const [groupName, setGroupName] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(event.target.value)
  }

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value)
  }

  function handleAddUser() {
    if (newUser.trim() !== '') {
      setUsers([...users, newUser.trim()])
      setNewUser('')
    }
  }
  
  function handleKeyDown2(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleAddUser()
    }
  }

  function handleAddName() {
    setGroupName(groupName.trim())
  }

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/group-conversations/create`, {
        groupConversationName: groupName,
        creator: localStorage.getItem('user'),
        participantNames: users
      })
      console.log('Group created:', response.data)

      setMessage(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Verifica se o erro é um AxiosError
        console.error('Error creating group:', error);
        setMessage(error.response?.data || 'An unknown error occurred');
      } else {
        // Caso não seja um AxiosError, lidar com outros tipos de erro
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred');
      }
    }
  }

  function handleKeyDown1(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleAddUser()
    }
  }


  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold mb-5 mt-10">New Group:</h1>
      <p>Name: </p>
      <input
        className="bg-gray-700 rounded pl-1 mb-5"
        type="text"
        placeholder="Group Name: "
        value={groupName}
        onKeyDown={handleKeyDown2}
        onChange={handleInputChange2}
      />
      <button
        onClick={handleAddName}
        className="text-green-600 rounded px-2 border border-green-600 ml-2 hover:text-green-400 hover:border-green-400 transition">
        Add
      </button>
      <p>Participants:</p>
      <input
        className="bg-gray-700 rounded pl-1"
        type="text"
        placeholder="Participants: "
        value={newUser}
        onKeyDown={handleKeyDown1}
        onChange={handleInputChange}
      />
      <button
        onClick={handleAddUser}
        className="text-green-600 rounded px-2 border border-green-600 ml-2 hover:text-green-400 hover:border-green-400 transition mb-10">
        Add
      </button>
      <div className="flex w-1/2 mx-auto justify-center">
        {groupName ? (<p><span className='font-bold'>Group Name:</span> {groupName} </p>)
         : (
          <p className="mt-2">No name added</p>
        )}
      </div>
      <hr className='w-1/6 mx-auto my-3' />
      <div className="flex w-1/2 mx-auto justify-center">
        {users.length > 0 ? (
          users.map((user, index) => (
            <p key={index} className="ml-2">
             <span className='font-bold'>Participants: </span>{user},
            </p>
          ))
        ) : (
          <p className="mt-2">No participants added</p>
        )}
      </div>
      <button
        onClick={handleCreateGroup}
        className="bg-gray-800 border-2 border-gray-700 rounded px-3 mt-10 text-xl hover:bg-gray-600 transition">
        Create
      </button>
      <div>
        {message && <p className="font-bold text-white mt-5">{message}</p>}
      </div>
    </div>
  )
}
