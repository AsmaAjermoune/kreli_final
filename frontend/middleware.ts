// frontend/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROUTES  = ['/dashboard/admin']
const OWNER_ROUTES  = ['/dashboard/proprietaire']
const RENTER_ROUTES = ['/dashboard/locataire']
const PROTECTED     = ['/dashboard']

function extractRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role ?? null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('locamat_token')?.value

  const isProtected = PROTECTED.some(r => pathname.startsWith(r))
  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (token) {
    const role = extractRole(token)

    if (ADMIN_ROUTES.some(r => pathname.startsWith(r)) && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (
      OWNER_ROUTES.some(r => pathname.startsWith(r)) &&
      role !== 'proprietaire' && role !== 'both' && role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/dashboard/locataire', request.url))
    }
    if (
      RENTER_ROUTES.some(r => pathname.startsWith(r)) &&
      role !== 'locataire' && role !== 'both' && role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/dashboard/proprietaire', request.url))
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
