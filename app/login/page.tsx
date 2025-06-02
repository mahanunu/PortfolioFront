'use client';

import Login from '@/app/components/Login';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLoginSuccess = (userData: { email: string }, token: string) => {
    login(userData, token);
  };

  // Loading state avec animation
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto"></div>
          <p className="text-gray-600 font-medium text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              IIM Portfolio
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform transition-all duration-300 hover:shadow-3xl">
          {/* Welcome Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              ✨ Bienvenue
            </div>
          </div>

          {/* Login Component */}
          <Login onLoginSuccess={handleLoginSuccess} />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Première visite ?{' '}
              <span className="text-orange-600 font-semibold cursor-pointer hover:text-orange-700 transition-colors">
                Contactez l'administration
              </span>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-orange-600">150+</div>
              <div className="text-xs text-gray-600">Projets</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-xs text-gray-600">Étudiants</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-xs text-gray-600">Insertion</div>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2025 IIM Digital School. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-orange-400 rounded-full animate-bounce delay-100 hidden lg:block"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300 hidden lg:block"></div>
      <div className="absolute bottom-32 left-32 w-5 h-5 bg-purple-400 rounded-full animate-bounce delay-500 hidden lg:block"></div>
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-700 hidden lg:block"></div>
    </div>
  );
}