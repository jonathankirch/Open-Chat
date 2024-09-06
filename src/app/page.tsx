"use client"
import { useState } from "react"

export default function Home() {
  const [username, setUsername] = useState('')

  function setLoggedUser() {
      localStorage.setItem('user', username)
  }

  return (
    <div className="bg-gray-800 p-5">
      <h1 className="text-2xl font-bold text-center mt-24">Página inicial</h1>
    </div>
  )
}
