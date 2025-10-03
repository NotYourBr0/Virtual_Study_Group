# Virtual Study Group Platform

A real-time collaborative study platform where students can create study rooms, share notes, chat, and use synchronized timers to stay focused together.

## 🚀 Features

- **Real-time Collaborative Notes**: Multiple users can edit shared notes simultaneously
- **Live Chat**: Communicate with study partners in real-time
- **Synchronized Focus Timers**: Start, stop, and reset timers that sync across all users
- **Room Management**: Create private study rooms or join existing ones
- **Export Notes**: Download your collaborative notes as text files
- **User Presence**: See who's currently in your study room

## 🛠 Tech Stack

### Frontend
- **React** with **Vite** for fast development
- **TailwindCSS** for modern styling
- **Socket.io-client** for real-time communication
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with **Express**
- **Socket.io** for WebSocket connections
- **MongoDB** with **Mongoose** for data persistence
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
virtual-study-group/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Home and Room pages
│   │   ├── services/        # Socket.io and API services
│   │   └── ...
│   ├── .env                 # Frontend environment variables
│   └── package.json
├── backend/                  # Node.js backend
│   ├── models/              # MongoDB schemas
│   ├── server.js            # Main server file
│   ├── .env                 # Backend environment variables
│   └── package.json
└── README.md
```

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone/Download the project**

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   - Backend `.env` is already configured with your MongoDB connection
   - Frontend `.env` points to `http://localhost:5000`

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/virtual-study-group.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Set root directory to `frontend`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
   - Deploy

### Backend Deployment (Render)

1. **Create Render account** and connect GitHub

2. **Create new Web Service**
   - Connect your repository
   - Set root directory to `backend`
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Environment Variables** (in Render dashboard)
   ```
   MONGO_URI=mongodb+srv://ks806425_db_user:kartik123@cluster0.srdoacb.mongodb.net/virtual-study-group?retryWrites=true&w=majority&appName=Cluster0
   PORT=10000
   ```

4. **Update Frontend Environment**
   - Update `frontend/.env.production` with your Render backend URL
   - Redeploy frontend on Vercel

## 🧪 Testing the App

1. **Create a room**: Enter your name and room name, click "Create Room"
2. **Share room link**: Copy the URL and open in another browser/incognito tab
3. **Test real-time features**:
   - Type in shared notes → should appear in both windows
   - Send chat messages → should appear for all users
   - Start/stop timer → should sync across users

## 🎯 Demo Script (for Hackathons)

**60-second demo flow:**

1. **Pitch (10s)**: "Virtual Study Group helps students collaborate with shared notes, live chat, and synchronized focus timers"

2. **Create room (15s)**: Show creating a room and getting unique room ID

3. **Multi-window demo (20s)**: 
   - Open room in 2 browser windows
   - Type in notes → show real-time sync
   - Send chat message → show in both windows

4. **Timer demo (10s)**: Start timer, show it counts down in both windows

5. **Features highlight (5s)**: "Export notes, share room links, user presence tracking"

## 🔒 Production Considerations

### Security
- Input sanitization for notes and chat
- Rate limiting for API endpoints
- HTTPS enforcement
- Environment variable protection

### Scalability
- Database indexing on roomId
- Connection pooling
- CDN for static assets
- Horizontal scaling for Socket.io

## 🚀 Future Features

- **User Authentication**: JWT-based login system
- **Room Privacy**: Password-protected rooms
- **Study Analytics**: Track focus time and productivity
- **Subject Tags**: Categorize rooms by study topics
- **Mobile App**: React Native companion app
- **Video Integration**: Built-in video chat
- **Study Matching**: Find study partners by subject

## 📞 Support

If you encounter any issues:
1. Check that both frontend and backend are running
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is active
4. Check browser console for errors

---

**Built for hackathons** ⚡ **Ready to deploy** 🚀 **Scales with your needs** 📈