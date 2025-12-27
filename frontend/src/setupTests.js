import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-i18next for tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { changeLanguage: () => {} } })
}))
