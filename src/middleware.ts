import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
// Rutas que solo pueden acceder usuarios no autenticados
const authRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware processing request for path:', pathname);
  console.log('Token present:', !!token);

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  console.log('Is protected route:', isProtectedRoute);
  console.log('Is auth route:', isAuthRoute);

  // Si no hay token y es una ruta protegida, redirigir al login
  if (!token && isProtectedRoute) {
    console.log('No token found for protected route, redirecting to login');
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay token, verificar si es válido
  if (token) {
    try {
      console.log('Verifying token for path:', pathname);
      const decoded = await verifyToken(token);
      
      // Si el token es válido y estamos en una ruta de autenticación, redirigir al dashboard
      if (decoded && isAuthRoute) {
        console.log('Valid token found on auth route, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Si el token es inválido y estamos en una ruta protegida, redirigir al login
      if (!decoded && isProtectedRoute) {
        console.log('Invalid token found for protected route, redirecting to login');
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // Si hay un error al verificar el token y estamos en una ruta protegida, redirigir al login
      if (isProtectedRoute) {
        console.log('Error verifying token for protected route, redirecting to login');
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  console.log('Request proceeding normally');
  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
