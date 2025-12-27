import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { newsletter } from '../api'

export default function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await newsletter.subscribe(email)
      alert('Subscribed')
      setEmail('')
    } catch (err) {
      console.error(err)
      alert('Failed')
    } finally { setLoading(false) }
  }

  return (
    <footer className="bg-white mt-16 border-t">
      <div className="container mx-auto p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-blue-600">Amazon Affiliate</div>
          <div className="text-sm text-gray-600">Hand-managed affiliate posts, no scraping or API used.</div>
        </div>
        <form onSubmit={submit} className="mt-4 md:mt-0 flex gap-2">
          <label htmlFor="newsletter-email" className="sr-only">Email</label>
          <input id="newsletter-email" aria-label="Newsletter email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="border px-3 py-2 rounded" />
          <button className="bg-brand-blue text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">{loading ? '...' : t('footer.subscribe')}</button>
        </form>
        <div className="mt-3 text-xs text-gray-500">As an Amazon Associate I earn from qualifying purchases. All links are affiliate links.</div>
      </div>
    </footer>
  )
}
