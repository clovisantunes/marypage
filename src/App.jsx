
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import perfil from '../assets/perfil.png'
import LinksPage from './LinksPage'

function saveTrackingParams() {
  const params = new URLSearchParams(window.location.search)

  const trackingParams = [
    'fbclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ]

  trackingParams.forEach((param) => {
    const value = params.get(param)

    if (value) {
      localStorage.setItem(`tracking_${param}`, value)
    }
  })
}

function App() {
  const [isOnline] = useState(true)

  useEffect(() => {
    saveTrackingParams()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage isOnline={isOnline} />}
        />

        <Route
          path="/links"
          element={<LinksPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

function HomePage({ isOnline }) {
  return (
    <div className="container">
      <div className="card">

        <div className="verified-badge">
          <span className="sparkle">✦</span>
          <span>verificado</span>
        </div>

        <div className="avatar-container">
          <div className="avatar-ring">
            <div className="avatar">
              <img
                src={perfil}
                alt="Mary Velvet"
              />
            </div>
          </div>

          <div
            className={`online-status ${
              isOnline ? 'online' : 'offline'
            }`}
          >
            {isOnline ? '● online' : '● offline'}
          </div>
        </div>

        <h1 className="name">
          mary velvet
        </h1>

        <p className="username">
          ♡ entre no meu universo ♡
        </p>

        <p className="subtitle">
          meus links + onde me encontrar ✦
        </p>

        <Link
          to="/links"
          className="chat-button-link"
        >
          <button className="chat-button">
            <i className="fas fa-moon"></i>
            meus links 🌙
          </button>
        </Link>

        <div className="divider"></div>

        <p className="find-me">
          ♡ me encontre aqui ♡
        </p>

        <div className="social-icons">
          <a
            href="https://t.me/secretsmary"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link telegram-link"
          >
            <i className="fab fa-telegram"></i>
            <span className="social-label">
              telegram
            </span>
          </a>
        </div>

      </div>
    </div>
  )
}

export default App

