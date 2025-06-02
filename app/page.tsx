'use client';

import { useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ProjectList from "@/app/components/ProjectList";

// Constantes
const IIM_ORANGE = '#ef7b00';

// Types
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

// Composants réutilisables
const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-gray-700 hover:text-orange-500 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:bg-orange-50 relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg fixed w-full z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-12">
              <div className="flex-shrink-0">
                <Link href="/" className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                  IIM Portfolio
                </Link>
              </div>
              <div className="hidden md:flex space-x-2">
                <NavLink href="/projects">Projets</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                {user?.roles?.includes('ROLE_ADMIN') && (
                  <NavLink href="/admin">Administration</NavLink>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.firstName ? user.firstName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-semibold">
                  {user?.firstName ? `Bonjour ${user.firstName}` : user?.email}
                </span>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  router.push('/login');
                }}
                className="px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 space-y-8 z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                  ✨ Nouveauté 2025
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                  <span className="block mb-2">Découvrez les</span>
                  <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Projets Étudiants
                  </span>
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Une vitrine exceptionnelle des talents créatifs et innovants de l'IIM - Digital School Paris. 
                Explorez l'avenir du numérique à travers nos créations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/projects"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explorer les projets
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0 relative z-10">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/hero-image.jpg"
                  alt="IIM Projects Showcase"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-500 rounded-full animate-bounce delay-100"></div>
              <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-blue-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Admin Quick Actions */}
        {user?.roles?.includes('ROLE_ADMIN') && (
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Actions rapides</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/admin/projects/new"
                className="group flex items-center justify-center px-6 py-6 rounded-2xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-lg font-semibold">+ Nouveau projet</span>
              </Link>
              <Link 
                href="/admin/projects"
                className="group flex items-center justify-center px-6 py-6 rounded-2xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="text-lg font-semibold">📋 Gérer les projets</span>
              </Link>
              <Link 
                href="/admin/contacts"
                className="group flex items-center justify-center px-6 py-6 rounded-2xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="text-lg font-semibold">💬 Voir les contacts</span>
              </Link>
            </div>
          </section>
        )}

        {/* Projects List */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900">
                Projets récents
              </h2>
              <p className="text-gray-600">Découvrez les dernières créations de nos étudiants</p>
            </div>
            <Link 
              href="/projects"
              className="group flex items-center text-lg font-semibold text-orange-600 hover:text-orange-700 transition-all duration-300 bg-orange-50 hover:bg-orange-100 px-6 py-3 rounded-xl"
            >
              Voir tous les projets
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
          <ProjectList />
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-orange-100">Projets réalisés</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Étudiants actifs</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="text-4xl font-bold mb-2">95%</div>
            <div className="text-green-100">Taux d'insertion</div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 shadow-2xl text-center text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Intéressé par nos formations ?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Rejoignez l'IIM et développez vos compétences dans le numérique. 
              Notre service admissions est là pour vous accompagner dans votre parcours vers l'excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-gray-900 bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Nous contacter
              </Link>
              <Link 
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white border border-white/30 hover:bg-white/10 transition-all duration-300"
              >
                Voir nos projets
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 mt-20">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-2xl font-bold text-white">
                IIM Digital School
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                L'école de la passion créative et du numérique. Formant les talents de demain dans un environnement d'excellence et d'innovation.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-white font-bold">ig</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/projects" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Projets</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                  </Link>
                </li>
                <li>
                  <Link href="/formations" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Formations</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Légal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Mentions légales</span>
                  </Link>
                </li>
                <li>
                  <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Politique de confidentialité</span>
                  </Link>
                </li>
                <li>
                  <Link href="/conditions-utilisation" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Conditions d'utilisation</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} IIM Digital School. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-sm">
                Fait avec ❤️ par les étudiants IIM
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}