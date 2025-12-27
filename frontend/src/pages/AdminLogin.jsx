import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../api'
import { useTranslation } from 'react-i18next'

export default function AdminLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => { if (localStorage.getItem('token')) nav('/admin') }, [])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await auth.login(email, password)
      localStorage.setItem('token', res.data.token)
      nav('/admin')
    } catch (err) {
      console.error(err)
      alert(t('admin.login') + ' failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{t('admin.login')}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border px-3 py-2 rounded" />
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
