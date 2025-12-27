import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../Home'

test('renders Product List heading', () => {
  render(<Home />)
  expect(screen.getByText(/Product List|Mahsulotlar ro'yxati/i)).toBeInTheDocument()
})
