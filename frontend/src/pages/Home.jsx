import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Home() {
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()

  async function createRoom(e) {
    e.preventDefault()
    try {
      const res = await api.post('/api/rooms', { name: roomName || 'Study Room' })
      const roomId = res.data.roomId
      navigate(`/room/${roomId}`, { state: { displayName: name } })
    } catch (error) {
      alert('Error creating room: ' + error.message)
    }
  }

  function joinRoom(e) {
    e.preventDefault()
    // roomId typed directly into roomName
    if (!roomName) return alert('Enter room id')
    navigate(`/room/${roomName}`, { state: { displayName: name } })
  }

  return (
    <div className="min-h-screen bg-[url('/images/bg1.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Virtual Study Group</h1>
          <p className="text-gray-600">Collaborate, focus, and learn together</p>
        </div>
        
        <form onSubmit={createRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Enter your name (optional)"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name or ID</label>
            <input 
              value={roomName} 
              onChange={e=>setRoomName(e.target.value)} 
              placeholder="Room name or existing room ID"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Create Room
            </button>
            <button 
              type="button"
              onClick={joinRoom} 
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Join Room
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Real-time collaborative notes</li>
            <li>• Live chat with study partners</li>
            <li>• Synchronized focus timers</li>
            <li>• Automatic progress saving</li>
          </ul>
        </div>
      </div>
    </div>
  )
}