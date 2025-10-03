const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  name: { type: String, default: 'Study Room' },
  roomId: { type: String, required: true, unique: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Room', RoomSchema)