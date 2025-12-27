import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductCard from '../ProductCard'

const post = {
  _id: '1',
  title: 'Test Product',
  slug: 'test-product',
  description: 'Short description',
  affiliateLink: 'https://amzn.to/test'
}

test('renders product card with title and affiliate link', () => {
  render(<ProductCard post={post} />)
  expect(screen.getByText('Test Product')).toBeInTheDocument()
  const link = screen.getByRole('link', { name: /View on Amazon/i })
  expect(link).toHaveAttribute('href', post.affiliateLink)
  expect(link).toHaveAttribute('target', '_blank')
})
