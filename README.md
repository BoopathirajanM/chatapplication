# 💬 Modern Chat Application

A real-time chat application built with Spring Boot WebSocket backend and React.js frontend, featuring a beautiful modern UI with gradient themes and smooth animations.

## ✨ Features

- **Real-time messaging** with WebSocket connection
- **Public chat rooms** for group conversations
- **Private messaging** between users
- **Modern UI design** with gradient themes and animations
- **Responsive design** that works on desktop and mobile
- **User presence indicators** showing online status
- **Message timestamps** for better conversation tracking
- **Typing indicators** (ready for implementation)
- **Beautiful color themes** with orange-to-teal gradients

## 🎨 Design Highlights

- **Modern gradient backgrounds** with smooth color transitions
- **Animated message bubbles** with slide-in effects
- **Custom scrollbars** and hover effects
- **Responsive layout** that adapts to different screen sizes
- **Accessibility features** with proper focus states
- **Professional typography** using Inter font family

## 🛠️ Tech Stack

### Backend
- **Spring Boot** - Java framework for building the server
- **WebSocket** - Real-time bidirectional communication
- **STOMP** - Simple Text Oriented Messaging Protocol
- **Maven** - Dependency management

### Frontend
- **React.js** - Modern JavaScript library for UI
- **CSS3** - Advanced styling with variables and animations
- **WebSocket Client** - Real-time communication with server
- **Responsive Design** - Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Java 11 or higher
- Node.js 14 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatapplication.git
   cd chatapplication
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080`

3. **Start the Frontend Client**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The client will start on `http://localhost:3000`

## 📱 Usage

1. **Join the Chat**: Enter your username to connect to the chat
2. **Public Chat**: Send messages in the general chat room visible to all users
3. **Private Chat**: Click on any user in the sidebar to start a private conversation
4. **Real-time Updates**: See new messages and user connections instantly

## 🎯 Project Structure

```
chatapplication/
├── backend/                 # Spring Boot server
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # React.js client
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main app component
│   │   └── index.css     # Styling and themes
│   ├── public/           # Static assets
│   └── package.json      # npm dependencies
└── README.md
```

## 🌟 Key Components

### Backend
- **WebSocket Configuration** - Handles real-time connections
- **Message Controller** - Processes chat messages
- **User Management** - Tracks connected users

### Frontend
- **ChatRoom Component** - Main chat interface
- **Message Components** - Individual message rendering
- **User Interface** - Modern design with animations

## 🎨 Customization

The application uses CSS variables for easy theme customization:

```css
:root {
  --primary-color: #ff6b35;      /* Orange theme */
  --secondary-color: #4ecdc4;    /* Teal accent */
  --background-gradient: linear-gradient(135deg, #ff6b35 0%, #4ecdc4 100%);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent WebSocket support
- React.js community for the powerful frontend framework
- Contributors and testers who helped improve the application

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ using Spring Boot and React.js**