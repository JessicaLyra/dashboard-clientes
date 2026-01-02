import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // 🔒 Usuário não logado não entra na home (clientes)
  if (pathname === '/' && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🚫 Usuário logado não acessa login
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login'],
}
