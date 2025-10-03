import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  )
}
