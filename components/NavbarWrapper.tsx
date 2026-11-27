'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const LEGACY_NAV_PATHS = [
  '/products/footfall-engine',
  '/products/inbox-autopilot',
  '/pitch',
  '/neural-flow',
]

export default function NavbarWrapper() {
  const pathname = usePathname()
  const showLegacyNav = LEGACY_NAV_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (!showLegacyNav) return null
  return <Navbar />
}
