// App.jsx - Versão Final Corrigida
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import perfil from '../assets/perfil.png'
import LinksPage from './LinksPage'

// ===== SALVAR PARÂMETROS DE TRACKING =====
function saveTrackingParams() {
  const params = new URLSearchParams(window.location.search)
  const trackingParams = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

  trackingParams.forEach((param) => {
    const value = params.get(param)
    if (value) {
      localStorage.setItem(`tracking_${param}`, value)
    }
  })
}

// ===== GOOGLE ANALYTICS =====
function trackGA(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

// ===== META PIXEL - FUNIL LIMPO =====
function trackMeta(eventName, params = {}) {
  if (typeof window.fbq !== 'function') return

  // Mapeamento SEM duplicação de ViewContent
  const eventMap = {
    // 🔥 Intenção de compra
    click_vip_home: 'InitiateCheckout',
    click_vip_links: 'InitiateCheckout',
    
    // 📞 Contato
    click_telegram_home: 'Contact',
    click_telegram_links: 'Contact',
    click_group_links: 'Contact',
    
    // 🔙 Navegação
    click_back_links: 'CustomizeProduct',
    
    // ❌ REMOVIDO: click_my_links não mapeia mais para ViewContent
    // click_my_links: 'ViewContent'  ← REMOVIDO
  }

  const metaEvent = eventMap[eventName]

  if (!metaEvent) {
    // Evento personalizado (fallback)
    window.fbq('trackCustom', eventName, params)
    return
  }

  // Evento padrão do Meta
  window.fbq('track', metaEvent, {
    content_name: params.link_name || params.destination || eventName,
    content_category: params.position || 'geral',
    content_type: params.destination || 'link',
    ...params
  })
}

// ===== TRACKING DUPLO =====
function trackEvent(eventName, params = {}) {
  trackGA(eventName, params)
  trackMeta(eventName, params)

  if (import.meta.env.DEV) {
    console.log('📊 Evento:', {
      nome: eventName,
      params: params,
      timestamp: new Date().toISOString()
    })
  }
}

// ===== PAGE VIEW - SOMENTE PARA VISUALIZAÇÃO REAL =====
function trackPageView(pageName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      ...params
    })
  }

  // ⚠️ SÓ DISPARA ViewContent QUANDO A PÁGINA É REALMENTE VISUALIZADA
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: pageName,
      content_type: 'page',
      ...params
    })
  }
}

// ===== URL DO PRIVACY =====
function getPrivacyUrl() {
  const params = new URLSearchParams()
  const trackingParams = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

  trackingParams.forEach((param) => {
    const value = localStorage.getItem(`tracking_${param}`)
    if (value) {
      params.set(param, value)
    }
  })

  params.set('ref', 'maryvelvet')
  params.set('source', 'links_page')

  const query = params.toString()
  return query
    ? `https://privacy-maryvelvet.vercel.app/?${query}`
    : 'https://privacy-maryvelvet.vercel.app/?ref=maryvelvet'
}

// ===== ONLINE STATUS =====
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// ===== APP =====
function App() {
  const isOnline = useOnlineStatus()

  useEffect(() => {
    saveTrackingParams()
    // ⚠️ Home NÃO DISPARA ViewContent (só PageView automático do Pixel)
    // Apenas rastreia no GA4 se quiser
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: 'Home Page',
        page_location: window.location.href,
        page_type: 'home'
      })
    }
  }, [isOnline])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage isOnline={isOnline} />} />
        <Route path="/links" element={<LinksPage />} />
      </Routes>
    </BrowserRouter>
  )
}

// ===== HOME PAGE =====
function HomePage({ isOnline }) {
  const privacyUrl = getPrivacyUrl()

  return (
    <div className="container">
      <div className="card">

        <div className="badges-container">
          <div className="verified-badge">
            <span className="sparkle">✦</span>
            <span>verificado</span>
          </div>
          <div className={`online-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '● online' : '● offline'}
          </div>
        </div>

        <div className="avatar-container">
          <div className="avatar-ring">
            <div className="avatar">
              <img src={perfil} alt="Mary Velvet" />
            </div>
          </div>
        </div>

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
              destination: 'links',
              position: 'hero',
              cta_type: 'primary'
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
                destination: 'telegram',
                position: 'social',
                cta_type: 'secondary'
              })
            }
          >
            <i className="fab fa-telegram"></i>
            <span className="social-label">telegram</span>
          </a>

          {/* VIP - InitiateCheckout */}
          <a
            href={privacyUrl}
            className="social-link vip-link"
            onClick={() =>
              trackEvent('click_vip_home', {
                link_name: 'Acesso VIP',
                destination: 'privacy',
                position: 'social',
                cta_type: 'conversion'
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