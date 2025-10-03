import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { socket } from '../services/socket'

function MessageList({ messages }) {
  return (
    <div className="space-y-2 overflow-auto max-h-48">
      {messages.map((m, i) => (
        <div key={i} className="bg-white/80 p-3 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-blue-600">{m.user}</div>
          <div className="text-sm text-gray-700">{m.message}</div>
          <div className="text-xs text-gray-500 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  )
}

export default function Room() {
  const { roomId } = useParams()
  const loc = useLocation()
  const displayName = (loc.state && loc.state.displayName) || 'Guest'
  
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [notes, setNotes] = useState('')
  const [timer, setTimer] = useState(25*60) // default 25 min
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [users, setUsers] = useState([])
  const timerRef = useRef(null)

  useEffect(() => {
    socket.emit('join-room', { roomId, user: displayName })
    
    socket.on('chat-message', data => {
      setMessages(m => [...m, data])
    })
    
    socket.on('note-update', data => {
      setNotes(data.notes || '')
    })

    socket.on('user-joined', data => {
      setUsers(u => [...u, data.user])
      setMessages(m => [...m, {
        user: 'System',
        message: `${data.user} joined the room`,
        timestamp: Date.now()
      }])
    })

    socket.on('user-left', data => {
      setUsers(u => u.filter(user => user !== data.user))
      setMessages(m => [...m, {
        user: 'System', 
        message: `${data.user} left the room`,
        timestamp: Date.now()
      }])
    })

    socket.on('timer-start', () => {
      setIsTimerRunning(true)
    })

    socket.on('timer-stop', () => {
      setIsTimerRunning(false)
    })
    
    return () => {
      socket.emit('leave-room', { roomId, user: displayName })
      socket.off('chat-message')
      socket.off('note-update')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('timer-start')
      socket.off('timer-stop')
    }
  }, [roomId, displayName])

  function sendChat(e) {
    e?.preventDefault()
    if (!text) return
    const payload = { roomId, message: text, user: displayName, timestamp: Date.now() }
    socket.emit('chat-message', payload)
    setMessages(m => [...m, payload])
    setText('')
  }

  function updateNotes(newText) {
    setNotes(newText)
    socket.emit('note-update', { roomId, notes: newText })
  }

  function startTimer() {
    if (timerRef.current) return
    setIsTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsTimerRunning(false)
          socket.emit('timer-ended', { roomId })
          return 0
        }
        return t - 1
      })
    }, 1000)
    socket.emit('timer-start', { roomId, duration: timer })
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsTimerRunning(false)
      socket.emit('timer-stop', { roomId })
    }
  }

  function resetTimer() {
    stopTimer()
    setTimer(25 * 60)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Room: {roomId}</h1>
                <p className="text-gray-600">Welcome, {displayName}!</p>
              </div>
              <div className="text-sm text-gray-600">
                {users.length + 1} user{users.length === 0 ? '' : 's'} online
              </div>
            </div>
          </div>

          {/* Shared Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shared Notes</h2>
            <textarea 
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              value={notes} 
              onChange={e => updateNotes(e.target.value)}
              placeholder="Start taking collaborative notes here..."
            />
          </div>

          {/* Chat */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Chat</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <MessageList messages={messages} />
            </div>
            <form onSubmit={sendChat} className="flex gap-2">
              <input 
                value={text} 
                onChange={e => setText(e.target.value)} 
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message..."
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Timer */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Focus Timer</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatTime(timer)}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button 
                    onClick={startTimer} 
                    disabled={isTimerRunning}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-md font-medium transition duration-200"
                  >
                    {isTimerRunning ? 'Running...' : 'Start'}
                  </button>
                  <button 
                    onClick={stopTimer} 
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md font-medium transition duration-200"
                  >
                    Stop
                  </button>
                </div>
                <button 
                  onClick={resetTimer} 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-md font-medium transition duration-200"
                >
                  Reset (25m)
                </button>
              </div>
            </div>
          </div>

          {/* Room Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  const blob = new Blob([notes], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `study-notes-${roomId}.txt`
                  a.click()
                }}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded-md font-medium transition duration-200"
              >
                Export Notes
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Room link copied to clipboard!')
                }}
                className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 px-3 rounded-md font-medium transition duration-200"
              >
                Share Room Link
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-md font-medium transition duration-200"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Online Users */}
          {users.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Online Users</h2>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 font-medium">{displayName} (You)</div>
                {users.map((user, i) => (
                  <div key={i} className="text-sm text-gray-600">{user}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}