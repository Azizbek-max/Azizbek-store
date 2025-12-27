import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { posts } from '../api'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'

export default function Home() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await posts.list({ q, category })
      setItems(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function onSearch(e) {
    e.preventDefault();
    load();
  }

  return (
    <div>
      <Seo title="Product List" description="Browse hand-picked products with affiliate links" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t('home.title')}</h1>
        <form onSubmit={onSearch} className="flex gap-2">
          <input aria-label="Search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title" className="border rounded px-3 py-2" />
          <input aria-label="Category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="border rounded px-3 py-2" />
          <button className="bg-brand-blue text-white px-4 py-2 rounded">Search</button>
        </form>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(p => <ProductCard key={p._id} post={p} />)}
        </div>
      )}
    </div>
  )
}
