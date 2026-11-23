'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const HIDE_NAV_PATHS = ['/connect', '/dashboard', '/onboarding', '/admin', '/workspace']

export default function NavbarWrapper() {
  const pathname = usePathname()
  const launchPaths = ['/', '/products/reputation-manager', '/demo', '/how-it-works', '/pricing', '/contact']
  const hide = launchPaths.includes(pathname) || HIDE_NAV_PATHS.some(p => pathname.startsWith(p))
  if (hide) return null
  return <Navbar />
}
