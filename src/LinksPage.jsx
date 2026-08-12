// LinksPage.jsx - Com rastreamento duplo (GA + Meta Pixel)
import React from 'react'
import './LinksPage.css'
import perfil from '../assets/perfil.png'

function getTrackingParams() {
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

  return params.toString()
}

// ===== GOOGLE ANALYTICS =====
function trackGA(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

// ===== META PIXEL =====
function trackMeta(eventName, params = {}) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params)
  }
}

// ===== TRACKING DUPLO =====
function trackEvent(eventName, params = {}) {
  // Google Analytics
  trackGA(eventName, params)

  // Meta Pixel
  trackMeta(eventName, params)
}

function LinksPage() {
  const trackingParams = getTrackingParams()

  const privacyUrl = trackingParams
    ? `https://privacy-maryvelvet.vercel.app/?${trackingParams}`
    : 'https://privacy-maryvelvet.vercel.app/'

  return (
    <div className="links-container">
      <div className="links-card">

        <button
          className="back-button"
          onClick={() => {
            trackEvent('click_back_links', {
              link_name: 'Voltar',
              destination: 'home'
            })

            window.history.back()
          }}
        >
          ← voltar
        </button>

        <div className="links-header">
          <div className="avatar-mini">
            <img
              src={perfil}
              alt="Mary Velvet"
            />
          </div>

          <h2 className="links-title">
            mary velvet
          </h2>

          <p className="links-sub">
            ♡ entre no meu universo ♡
          </p>
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
                position: 'destaque'
              })
            }
          >
            <i className="fas fa-lock"></i>

            <div className="link-info">
              <span className="link-name vip-name">
                🔒 ACESSO VIP
              </span>

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
                position: 'lista'
              })
            }
          >
            <i className="fab fa-telegram"></i>

            <div className="link-info">
              <span className="link-name">
                💬 TELEGRAM
              </span>

              <span className="link-desc">
                acompanhe as novidades
              </span>
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
                position: 'lista'
              })
            }
          >
            <i className="fas fa-users"></i>

            <div className="link-info">
              <span className="link-name">
                👥 GRUPO GRÁTIS
              </span>

              <span className="link-desc">
                conheça primeiro
              </span>
            </div>

            <i className="fas fa-chevron-right"></i>
          </a>

        </div>
      </div>
    </div>
  )
}

export default LinksPage