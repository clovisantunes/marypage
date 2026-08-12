// App.jsx - Otimizado para Conversão (Meta Pixel + GA4)
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

// ===== GOOGLE ANALYTICS 4 =====
function trackGA(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      send_to: 'G-CZCEKMJJW8'
    })
  }
}

// ===== META PIXEL - EVENTOS PADRÃO OTIMIZADOS =====
function trackMeta(eventName, params = {}) {
  if (typeof window.fbq !== 'function') return

  // Mapeamento estratégico para eventos padrão do Meta
  const eventMap = {
    // 🔥 CRÍTICOS - Otimizam campanhas
    'click_vip_home': { event: 'Lead', priority: 'high' },
    'click_vip_links': { event: 'Lead', priority: 'high' },
    'click_vip': { event: 'Lead', priority: 'high' },
    
    // 📞 CONTATO - Engajamento
    'click_telegram_home': { event: 'Contact', priority: 'medium' },
    'click_telegram_links': { event: 'Contact', priority: 'medium' },
    'click_group_links': { event: 'Contact', priority: 'medium' },
    'click_telegram': { event: 'Contact', priority: 'medium' },
    
    // 👀 VISUALIZAÇÃO - Aquecimento
    'click_my_links': { event: 'ViewContent', priority: 'low' },
    'view_links_page': { event: 'ViewContent', priority: 'low' },
    
    // 🔙 NAVEGAÇÃO
    'click_back_links': { event: 'CustomizeProduct', priority: 'low' },
    'click_back': { event: 'CustomizeProduct', priority: 'low' },
  }

  const mapped = eventMap[eventName]
  
  if (mapped) {
    // Evento padrão do Meta com parâmetros ricos
    window.fbq('track', mapped.event, {
      content_name: params.link_name || params.destination || eventName,
      content_category: params.position || 'geral',
      content_type: params.destination || 'link',
      value: params.value || 0,
      currency: 'BRL',
      ...params
    })
    
    // 🔥 PARA LEAD - Dispara evento de conversão com mais dados
    if (mapped.event === 'Lead') {
      window.fbq('track', 'Lead', {
        content_name: 'Acesso VIP',
        content_category: 'conversao',
        value: 0.01, // Valor simbólico para Meta otimizar
        currency: 'BRL',
        ...params
      })
    }
  } else {
    // Fallback para eventos personalizados
    window.fbq('trackCustom', eventName, params)
  }
}

// ===== TRACKING DUPLO OTIMIZADO =====
function trackEvent(eventName, params = {}) {
  // Google Analytics
  trackGA(eventName, params)

  // Meta Pixel (com eventos padrão)
  trackMeta(eventName, params)

  // 🔍 Debug em desenvolvimento
  if (import.meta.env.DEV) {
    console.log('📊 Evento rastreado:', {
      nome: eventName,
      params: params,
      timestamp: new Date().toISOString()
    })
  }
}

// ===== EVENTO DE VISUALIZAÇÃO DE PÁGINA =====
function trackPageView(pageName, params = {}) {
  // GA4 - PageView
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      ...params
    })
  }

  // Meta Pixel - PageView já é disparado automaticamente no index.html
  // Mas podemos enviar eventos adicionais
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: pageName,
      content_type: 'page',
      ...params
    })
  }
}

// ===== URL DO PRIVACY COM TRACKING =====
function getPrivacyUrl() {
  const params = new URLSearchParams()
  const trackingParams = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

  trackingParams.forEach((param) => {
    const value = localStorage.getItem(`tracking_${param}`)
    if (value) {
      params.set(param, value)
    }
  })

  // 🔥 Adiciona parâmetro de origem para saber que veio da Mary Velvet
  params.set('ref', 'maryvelvet')
  params.set('source', 'links_page')

  const query = params.toString()
  return query
    ? `https://privacy-maryvelvet.vercel.app/?${query}`
    : 'https://privacy-maryvelvet.vercel.app/?ref=maryvelvet'
}

// ===== VERIFICAR STATUS =====
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

// ===== APP PRINCIPAL =====
function App() {
  const isOnline = useOnlineStatus()

  useEffect(() => {
    saveTrackingParams()
    
    // Rastreia visualização da página inicial
    trackPageView('Home Page', {
      page_type: 'home',
      is_online: isOnline
    })
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

  // Rastreia visualização da Home (adicional)
  useEffect(() => {
    trackPageView('Home Page View', {
      page_section: 'home',
      timestamp: new Date().toISOString()
    })
  }, [])

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
          onClick={() => {
            trackEvent('click_my_links', {
              link_name: 'Meus links',
              destination: 'links',
              position: 'hero',
              cta_type: 'primary'
            })
          }}
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
            onClick={() => {
              trackEvent('click_telegram_home', {
                link_name: 'Telegram',
                destination: 'telegram',
                position: 'social',
                cta_type: 'secondary'
              })
            }}
          >
            <i className="fab fa-telegram"></i>
            <span className="social-label">telegram</span>
          </a>

          {/* ACESSO VIP - BOT/PRIVACY */}
          <a
            href={privacyUrl}
            className="social-link vip-link"
            onClick={() => {
              trackEvent('click_vip_home', {
                link_name: 'Acesso VIP',
                destination: 'privacy',
                position: 'social',
                cta_type: 'conversion',
                value: 0.01 // Valor simbólico
              })
            }}
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