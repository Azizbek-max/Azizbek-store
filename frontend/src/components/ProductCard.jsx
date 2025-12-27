import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ProductCard({ post }) {
  const { t } = useTranslation()
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      {post.image ? (
        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-brand-blue">{post.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{post.description ? post.description.slice(0, 120) + (post.description.length > 120 ? '...' : '') : ''}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/product/${post.slug}`} className="text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">View</Link>
          <a href={post.affiliateLink} aria-label={`View ${post.title} on Amazon`} target="_blank" rel="noreferrer" className="bg-brand-orange text-white px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">{t('product.viewOnAmazon')}</a>
        </div>
      </div>
    </div>
  )
}
