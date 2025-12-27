import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

test('renders skip link and site name', () => {
  render(<Header />)
  expect(screen.getByText(/Skip to content/i)).toBeInTheDocument()
  expect(screen.getByText(/Amazon Affiliate|siteName/i)).toBeInTheDocument()
})
