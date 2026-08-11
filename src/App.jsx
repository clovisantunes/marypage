// App.jsx - Página Inicial Atualizada
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

// ===== GOOGLE ANALYTICS =====
function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

// ===== URL DO PRIVACY COM TRACKING =====
function getPrivacyUrl() {
  const params = new URLSearchParams()

  const trackingParams = [
    'fbclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ]

  trackingParams.forEach((param) => {
    const value = localStorage.getItem(`tracking_${param}`)

    if (value) {
      params.set(param, value)
    }
  })

  const query = params.toString()

  return query
    ? `https://privacy-maryvelvet.vercel.app/?${query}`
    : 'https://privacy-maryvelvet.vercel.app/'
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
  const privacyUrl = getPrivacyUrl()

  return (
    <div className="container">
      <div className="card">

        {/* BADGES */}
        <div className="badges-container">
          <div className="verified-badge">
            <span className="sparkle">✦</span>
            <span>verificado</span>
          </div>

          <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '● online' : '● offline'}
          </div>
        </div>

        {/* AVATAR */}
        <div className="avatar-container">
          <div className="avatar-ring">
            <div className="avatar">
              <img src={perfil} alt="Mary Velvet" />
            </div>
          </div>
        </div>

        {/* NOME E DESCRIÇÃO */}
        <h1 className="name">mary velvet</h1>
        <p className="username">♡ entre no meu universo ♡</p>
        <p className="subtitle">meus links + onde me encontrar ✦</p>

        {/* CTA PRINCIPAL - MEUS LINKS */}
        <Link
          to="/links"
          className="main-cta-link"
          onClick={() =>
            trackEvent('click_my_links', {
              link_name: 'Meus links',
              destination: 'links'
            })
          }
        >
          <button className="main-cta-button">
            <i className="fas fa-moon"></i>
            meus links
          </button>
        </Link>

        <div className="divider"></div>

        <p className="find-me">♡ me encontre aqui ♡</p>

        {/* LINKS SOCIAIS */}
        <div className="social-icons">
          {/* TELEGRAM */}
          <a
            href="https://t.me/secretsmary"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link telegram-link"
            onClick={() =>
              trackEvent('click_telegram_home', {
                link_name: 'Telegram',
                destination: 'telegram'
              })
            }
          >
            <i className="fab fa-telegram"></i>
            <span className="social-label">telegram</span>
          </a>

          {/* ACESSO VIP - COM A MESMA LINGUAGEM DA PÁGINA /LINKS */}
          <a
            href={privacyUrl}
            className="social-link vip-link"
            onClick={() =>
              trackEvent('click_vip_home', {
                link_name: 'Acesso VIP',
                destination: 'privacy'
              })
            }
          >
            <i className="fas fa-lock"></i>
            <div className="vip-label-wrapper">
              <span className="social-label vip-label">acesso VIP</span>
              <span className="vip-micro">+100 vídeos e fotos · conteúdo novo toda semana</span>
            </div>
          </a>
        </div>

      </div>
    </div>
  )
}

export default App