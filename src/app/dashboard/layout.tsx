import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      redirect('/auth/login');
    }
  } catch (error) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
} 