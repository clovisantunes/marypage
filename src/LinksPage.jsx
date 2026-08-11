
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
          onClick={() => window.history.back()}
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

          <a
            href={privacyUrl}
            className="link-item privacy"
          >
            <i className="fas fa-lock"></i>

            <div className="link-info">
              <span className="link-name">
                privacy
              </span>

              <span className="link-desc">
                pagamento seguro
              </span>
            </div>

            <i className="fas fa-chevron-right"></i>
          </a>

          <a
            href="https://t.me/marysvelvetbot"
            className="link-item telegram"
          >
            <i className="fab fa-telegram"></i>

            <div className="link-info">
              <span className="link-name">
                meu telegram
              </span>

              <span className="link-desc">
                conteúdo exclusivo
              </span>
            </div>

            <i className="fas fa-chevron-right"></i>
          </a>

          <a
            href="https://t.me/secretsmary"
            className="link-item group"
          >
            <i className="fas fa-users"></i>

            <div className="link-info">
              <span className="link-name">
                grupinho grátis
              </span>

              <span className="link-desc">
                entre e conheça
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
