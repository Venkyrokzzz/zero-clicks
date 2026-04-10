'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const HIDE_NAV_PATHS = ['/connect']

export default function NavbarWrapper() {
  const pathname = usePathname()
  const hide = HIDE_NAV_PATHS.some(p => pathname.startsWith(p))
  if (hide) return null
  return <Navbar />
}
