import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const nav = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const { t } = useTranslation()
  function logout() {
    localStorage.removeItem('token')
    nav('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <a className="sr-only focus:not-sr-only" href="#main">Skip to content</a>
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-blue">{t('siteName')}</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">{t('home.title')}</Link>
          {token ? (
            <button onClick={logout} className="text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">Logout</button>
          ) : (
            <Link to="/admin/login" className="text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">{t('admin.login')}</Link>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
