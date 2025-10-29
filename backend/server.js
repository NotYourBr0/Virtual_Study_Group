const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const Room = require('./models/Room')

const app = express()
app.use(express.json())
app.use(cors())
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vsg'
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e => console.error('❌ MongoDB connection error:', e))

// Generate random room ID
function generateRoomId() {
  return Math.random().toString(36).slice(2, 9)
}

// REST API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Virtual Study Group API', status: 'online' })
})

// Create a new room
app.post('/api/rooms', async (req, res) => {
  try {
    const { name } = req.body
    const roomId = generateRoomId()
    const room = new Room({ 
      name: name || 'Study Room', 
      roomId 
    })
    await room.save()
    res.json(room)
  } catch (error) {
    console.error('Error creating room:', error)
    res.status(500).json({ error: 'Failed to create room' })
  }
})

// Get room info
app.get('/api/rooms/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }
    res.json(room)
  } catch (error) {
    console.error('Error fetching room:', error)
    res.status(500).json({ error: 'Failed to fetch room' })
  }
})

// Create HTTP server and Socket.io
const server = http.createServer(app)
const io = new Server(server, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
})

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔗 Socket connected:', socket.id)

  // User joins a room
  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-joined', { user })
    console.log(`👋 ${user} joined room ${roomId}`)
  })

  // User leaves a room
  socket.on('leave-room', ({ roomId, user }) => {
    socket.leave(roomId)
    socket.to(roomId).emit('user-left', { user })
    console.log(`👋 ${user} left room ${roomId}`)
  })

  // Handle chat messages
  socket.on('chat-message', async (data) => {
    const { roomId, message, user, timestamp } = data
    // Broadcast to all users in the room (including sender)
    io.to(roomId).emit('chat-message', data)
    
    // Update room last activity
    try {
      await Room.findOneAndUpdate(
        { roomId }, 
        { lastActivity: new Date() }
      )
    } catch (error) {
      console.error('Error updating room activity:', error)
    }
    
    console.log(`💬 ${user} in ${roomId}: ${message}`)
  })

  // Handle note updates
  socket.on('note-update', async ({ roomId, notes }) => {
    // Broadcast to other users in the room (not sender)
    socket.to(roomId).emit('note-update', { notes })
    
    // Save notes to database
    try {
      await Room.findOneAndUpdate(
        { roomId }, 
        { notes, lastActivity: new Date() }
      )
    } catch (error) {
      console.error('Error saving notes:', error)
    }
    
    console.log(`📝 Notes updated in room ${roomId}`)
  })

  // Handle timer events
  socket.on('timer-start', ({ roomId, duration }) => {
    socket.to(roomId).emit('timer-start', { duration })
    console.log(`⏰ Timer started in room ${roomId} for ${duration} seconds`)
  })

  socket.on('timer-stop', ({ roomId }) => {
    socket.to(roomId).emit('timer-stop')
    console.log(`⏸️ Timer stopped in room ${roomId}`)
  })

  socket.on('timer-ended', ({ roomId }) => {
    io.to(roomId).emit('timer-ended')
    console.log(`⏰ Timer ended in room ${roomId}`)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 API available at http://localhost:${PORT}`)
})