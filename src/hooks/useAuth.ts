import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un token en las cookies
    const token = document.cookie.includes('token=');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const logout = () => {
    // Eliminar el token de las cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
}
