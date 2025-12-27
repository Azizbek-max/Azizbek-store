import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description }) {
  const site = import.meta.env.VITE_SITE_NAME || 'Amazon Affiliate'
  return (
    <Helmet>
      <title>{title ? `${title} | ${site}` : site}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Open Graph basic */}
      <meta property="og:title" content={title || site} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  )
}
