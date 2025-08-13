# MERN Real-Time Chat App

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring instant messaging, user authentication, and real-time notifications.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: Secure login/signup with JWT tokens
- **User Profiles**: Customizable profiles with bio and profile pictures
- **Online Status**: Real-time online/offline user indicators
- **Image Sharing**: Send and receive images in conversations
- **Message Status**: Read receipts and message delivery status
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI
- **File Upload**: Cloudinary integration for profile picture uploads
- **Secure**: Password hashing with bcrypt and secure cookie handling

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload and storage
- **Multer** - File upload handling

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📁 Project Structure

```
MERN-Real-Time-Chat-App/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── lib/             # Database connection
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── context/     # React context providers
│   │   └── lib/         # Utility functions
│   ├── public/          # Static assets
│   └── package.json
├── package.json         # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/safwan-ms/MERN-Real-Time-Chat-App.git
   cd MERN-Real-Time-Chat-App
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   npm install --prefix frontend
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the application**

   **Development mode (both frontend and backend):**

   ```bash
   npm run dev
   ```

   **Frontend only:**

   ```bash
   npm run frontend
   ```

   **Backend only:**

   ```bash
   npm run backend
   ```

   **Production build:**

   ```bash
   npm run build
   npm start
   ```

## 📱 Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Profile Setup**: Add a profile picture and bio
3. **Start Chatting**: Select users from the online list to start conversations
4. **Real-time Messaging**: Send text messages and images instantly
5. **Online Status**: See who's currently online and active

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - To Check if authenticated

### Messages

- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages/send/:id` - Send a message
- `PUT /api/messages/seen/:id` - Mark messages as read

### Users

- `GET /api/users` - Get all users
- `PUT /api/auth/update-profile` - Update user profile

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Secure cookie handling
- CORS configuration
- Input validation and sanitization

## 🎨 UI/UX Features

- Modern, responsive design
- Dark theme with purple accent
- Smooth animations and transitions
- Toast notifications
- Loading states and error handling
- Mobile-friendly interface

## 🚀 Deployment

### Backend Deployment (Heroku/ Railway/ Render)

1. Set environment variables
2. Deploy the backend directory
3. Configure MongoDB connection

### Frontend Deployment (Vercel/ Netlify)

1. Build the frontend: `npm run build --prefix frontend`
2. Deploy the `frontend/dist` directory
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ using the MERN stack.

---

**Note**: Make sure to replace placeholder values (like API keys, database URLs) with your actual credentials before running the application.
