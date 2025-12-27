import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const change = (lng) => { i18n.changeLanguage(lng) }
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => change('en')} className="text-sm">EN</button>
      <button onClick={() => change('uz')} className="text-sm">UZ</button>
    </div>
  )
}
