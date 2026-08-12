// LinksPage.jsx - Otimizado para Conversão
import React, { useEffect } from 'react'
import './LinksPage.css'
import perfil from '../assets/perfil.png'

// ===== FUNÇÕES DE TRACKING (MESMAS DO APP.JSX) =====
function getTrackingParams() {
  const params = new URLSearchParams()
  const trackingParams = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

  trackingParams.forEach((param) => {
    const value = localStorage.getItem(`tracking_${param}`)
    if (value) {
      params.set(param, value)
    }
  })

  return params.toString()
}

function trackGA(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

function trackMeta(eventName, params = {}) {
  if (typeof window.fbq !== 'function') return

  const eventMap = {
    'click_vip_links': { event: 'Lead', priority: 'high' },
    'click_vip': { event: 'Lead', priority: 'high' },
    'click_telegram_links': { event: 'Contact', priority: 'medium' },
    'click_group_links': { event: 'Contact', priority: 'medium' },
    'click_back_links': { event: 'CustomizeProduct', priority: 'low' },
    'view_links_page': { event: 'ViewContent', priority: 'low' },
  }

  const mapped = eventMap[eventName]
  
  if (mapped) {
    window.fbq('track', mapped.event, {
      content_name: params.link_name || params.destination || eventName,
      content_category: params.position || 'links',
      ...params
    })
  } else {
    window.fbq('trackCustom', eventName, params)
  }
}

function trackEvent(eventName, params = {}) {
  trackGA(eventName, params)
  trackMeta(eventName, params)

  if (import.meta.env.DEV) {
    console.log('📊 Evento LinksPage:', { nome: eventName, params })
  }
}

function trackPageView(pageName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      ...params
    })
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: pageName,
      content_type: 'page',
      ...params
    })
  }
}

// ===== COMPONENTE PRINCIPAL =====
function LinksPage() {
  const trackingParams = getTrackingParams()

  const privacyUrl = trackingParams
    ? `https://privacy-maryvelvet.vercel.app/?${trackingParams}&ref=maryvelvet&source=links_page`
    : 'https://privacy-maryvelvet.vercel.app/?ref=maryvelvet&source=links_page'

  // Rastreia visualização da página de links
  useEffect(() => {
    trackPageView('Links Page', {
      page_type: 'links',
      timestamp: new Date().toISOString()
    })
  }, [])

  return (
    <div className="links-container">
      <div className="links-card">

        <button
          className="back-button"
          onClick={() => {
            trackEvent('click_back_links', {
              link_name: 'Voltar',
              destination: 'home',
              position: 'header'
            })
            window.history.back()
          }}
        >
          ← voltar
        </button>

        <div className="links-header">
          <div className="avatar-mini">
            <img src={perfil} alt="Mary Velvet" />
          </div>
          <h2 className="links-title">mary velvet</h2>
          <p className="links-sub">♡ entre no meu universo ♡</p>
        </div>

        <div className="links-list">

          {/* VIP - ACESSO VIP (PRIVACY) - EM DESTAQUE */}
          <a
            href={privacyUrl}
            className="link-item vip"
            onClick={() =>
              trackEvent('click_vip_links', {
                link_name: 'Acesso VIP',
                destination: 'privacy',
                position: 'destaque',
                cta_type: 'conversion',
                value: 0.01
              })
            }
          >
            <i className="fas fa-lock"></i>
            <div className="link-info">
              <span className="link-name vip-name">🔒 ACESSO VIP</span>
              <span className="link-desc vip-desc">
                +100 vídeos e fotos · conteúdo novo toda semana
              </span>
            </div>
            <i className="fas fa-chevron-right vip-arrow"></i>
          </a>

          {/* TELEGRAM */}
          <a
            href="https://t.me/marysvelvetbot"
            className="link-item telegram"
            onClick={() =>
              trackEvent('click_telegram_links', {
                link_name: 'Telegram',
                destination: 'telegram',
                position: 'lista',
                cta_type: 'secondary'
              })
            }
          >
            <i className="fab fa-telegram"></i>
            <div className="link-info">
              <span className="link-name">💬 TELEGRAM</span>
              <span className="link-desc">acompanhe as novidades</span>
            </div>
            <i className="fas fa-chevron-right"></i>
          </a>

          {/* GRUPO GRÁTIS */}
          <a
            href="https://t.me/secretsmary"
            className="link-item group"
            onClick={() =>
              trackEvent('click_group_links', {
                link_name: 'Grupo grátis',
                destination: 'group',
                position: 'lista',
                cta_type: 'secondary'
              })
            }
          >
            <i className="fas fa-users"></i>
            <div className="link-info">
              <span className="link-name">👥 GRUPO GRÁTIS</span>
              <span className="link-desc">conheça primeiro</span>
            </div>
            <i className="fas fa-chevron-right"></i>
          </a>

        </div>
      </div>
    </div>
  )
}

export default LinksPage