import React, { useState } from 'react'
import './App.css'
import perfil from '../assets/perfil.png'

function App() {
  const [isOnline, setIsOnline] = useState(true)
  const link = "http://t.me/marysvelvetbot"

  return (
    <div className="container">
      <div className="card">
        <div className="verified-badge">
          <span className="sparkle">✨</span>
          <span>Perfil Verificado</span>
        </div>

        <div className="avatar-container">
          <div className="avatar-ring">
            <div className="avatar">
              <img src={perfil} alt="Mary Velvet" />
            </div>
          </div>
          <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '● Online agora' : '● Offline'}
          </div>
        </div>

        <h1 className="name">Mary Velvet</h1>
        <p className="username">@maryvelvet</p>

        <a href={link} className="chat-button-link">
          <button className="chat-button">
            <i className="fas fa-comment-dots"></i>
            Conversar Agora
          </button>
        </a>

        <div className="divider"></div>

        <div className="social-icons">
          <a 
            href="https://t.me/secretsmary" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-link"
            title="Telegram"
          >
            <i className="fab fa-telegram"></i>
          </a>
          <a 
            href="https://syncpaycheckout.com.br/checkout/a197c474-04b8-4746-a082-e9a57a4f733d+a197c393-8d1b-4a87-9980-667684aa1bfc" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-link"
            title="Privacy"
          >
            <i className="fas fa-lock"></i>
          </a>
        </div>
      </div>
    </div>
  )
}

export default App