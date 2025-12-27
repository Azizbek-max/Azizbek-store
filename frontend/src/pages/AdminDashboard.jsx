import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { posts } from '../api'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [affiliateLink, setAffiliateLink] = useState('')
  const [categories, setCategories] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => { if (!localStorage.getItem('token')) nav('/admin/login'); loadPosts() }, [])
  async function loadPosts() {
    try {
      const res = await posts.list()
      setList(res.data)
    } catch (err) { console.error(err) }
  }

  async function submit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('affiliateLink', affiliateLink);
    form.append('categories', categories);
    if (image) form.append('image', image);
    setLoading(true)
    try {
      await posts.create(form)
      alert('Post created')
      setTitle(''); setDescription(''); setAffiliateLink(''); setCategories(''); setImage(null)
      loadPosts()
    } catch (err) {
      console.error(err)
      alert('Failed')
    } finally { setLoading(false) }
  }

  async function removePost(id) {
    if (!confirm('Delete post?')) return;
    try {
      await posts.remove(id)
      loadPosts()
    } catch (err) { console.error(err); alert('Failed') }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">{t('admin.createPost')}</h3>
        <form onSubmit={submit} className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded" />
          <input value={affiliateLink} onChange={e => setAffiliateLink(e.target.value)} placeholder="Affiliate Link" className="w-full border px-3 py-2 rounded" required />
          <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="Categories (comma-separated)" className="w-full border px-3 py-2 rounded" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded"></textarea>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
          <button className="bg-brand-blue text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">{loading ? 'Saving…' : 'Save'}</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Posts</h3>
        <div className="space-y-3">
          {list.map(p => (
            <div key={p._id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-semibold text-brand-blue">{p.title}</div>
                <div className="text-sm text-gray-600">{p.categories?.join(', ')}</div>
              </div>
              <div className="flex gap-2">
                <a className="text-sm text-gray-700" href={`/product/${p.slug}`}>View</a>
                <button onClick={() => removePost(p._id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
