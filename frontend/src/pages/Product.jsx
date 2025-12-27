import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { posts, comments } from '../api'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'

export default function Product() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [commentsList, setCommentsList] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await posts.getBySlug(slug)
        setPost(res.data)
        const c = await comments.byPost(res.data._id)
        setCommentsList(c.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const { t } = useTranslation()

  async function submitComment() {
    try {
      await comments.create({ postId: post._id, text: commentText, rating })
      const c = await comments.byPost(post._id)
      setCommentsList(c.data)
      setCommentText('')
      setRating(5)
    } catch (err) {
      console.error(err)
      alert(t('product.submit'))
    }
  }

  if (loading) return <p>Loading…</p>
  if (!post) return <p>{t('product.notFound')}</p>

  return (
    <div>
      <Seo title={post.title} description={post.description?.slice(0, 160)} />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        {post.image && <img src={post.image} alt={post.title} className="w-full h-80 object-cover mb-4" loading="lazy" />}
        <h1 className="text-2xl font-bold text-brand-blue">{post.title}</h1>
        <p className="mt-3 text-gray-700">{post.description}</p>
        <div className="mt-6">
          <a href={post.affiliateLink} target="_blank" rel="noreferrer" className="bg-brand-orange text-white px-6 py-3 rounded-lg font-semibold">{t('product.viewOnAmazon')}</a>
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold">{t('product.comments')}</h2>
        <div className="mt-4 space-y-4">
          {commentsList.map(c => (
            <div key={c._id} className="border rounded p-3">
              <div className="text-sm font-semibold">{c.user?.name || 'User'} <span className="text-xs text-gray-500"> — {c.rating}★</span></div>
              <div className="text-sm text-gray-700 mt-1">{c.text}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea aria-label="Comment" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment" className="w-full border p-2 rounded"></textarea>
          <div className="flex items-center gap-2 mt-2">
            <select value={rating} onChange={e => setRating(e.target.value)} className="border rounded p-2">
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <button onClick={submitComment} className="bg-blue-600 text-white px-4 py-2 rounded">{t('product.submit')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
