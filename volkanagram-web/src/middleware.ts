import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const protectedRoutes = ['/dashboard', '/create', '/profile']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
