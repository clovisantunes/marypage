// LinksPage.jsx - Versão Final
import React, { useEffect } from 'react'
import './LinksPage.css'
import perfil from '../assets/perfil.png'

// ===== FUNÇÕES DE TRACKING =====
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

  // FUNIL CORRETO - SEM LEAD FALSO
  const eventMap = {
    // 🛒 Intenção de compra
    click_vip_links: 'InitiateCheckout',
    
    // 📞 Contato
    click_telegram_links: 'Contact',
    click_group_links: 'Contact',
    
    // 🔙 Navegação
    click_back_links: 'CustomizeProduct',
    
    // 👀 Visualização
    view_links_page: 'ViewContent'
  }

  const metaEvent = eventMap[eventName]

  if (!metaEvent) {
    window.fbq('trackCustom', eventName, params)
    return
  }

  window.fbq('track', metaEvent, {
    content_name: params.link_name || params.destination || eventName,
    content_category: params.position || 'links',
    content_type: params.destination || 'link',
    ...params
  })
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

// ===== LINKSPAGE =====
function LinksPage() {
  const trackingParams = getTrackingParams()

  const privacyUrl = trackingParams
    ? `https://privacy-maryvelvet.vercel.app/?${trackingParams}&ref=maryvelvet&source=links_page`
    : 'https://privacy-maryvelvet.vercel.app/?ref=maryvelvet&source=links_page'

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

          {/* 🔥 VIP - InitiateCheckout (intenção de compra) */}
          <a
            href={privacyUrl}
            className="link-item vip"
            onClick={() =>
              trackEvent('click_vip_links', {
                link_name: 'Acesso VIP',
                destination: 'privacy',
                position: 'destaque',
                cta_type: 'conversion'
                // ❌ SEM Lead aqui!
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