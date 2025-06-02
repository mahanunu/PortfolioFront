'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importer jwt-decode

interface User {
  email?: string;
  roles?: string[]; // Les tokens JWT contiennent souvent les rôles
  firstName?: string; // Ajouter firstName
  // Ajoutez d'autres champs que vous pourriez avoir dans votre token (ex: id, firstName)
}

interface DecodedToken {
  email?: string; // Ou 'username' selon ce que votre backend met dans le token
  roles?: string[];
  firstName?: string; // Attendre firstName du token
  iat?: number;
  exp?: number;
  // autres champs du payload JWT
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void; // userData est ce que l'UI connaît, le token est la preuve
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        // Vérifier si le token est expiré
        if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({ 
            email: decodedToken.email, 
            roles: decodedToken.roles, 
            firstName: decodedToken.firstName 
          }); // Extraire les infos du token
        } else {
          // Token expiré
          localStorage.removeItem('jwtToken');
        }
      } catch (error) {
        // Token invalide ou erreur de décodage
        console.error("Failed to decode JWT token:", error);
        localStorage.removeItem('jwtToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('jwtToken', token);
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setIsAuthenticated(true);
      // Utiliser userData fourni par le formulaire de login pour l'email initial,
      // car le token pourrait ne pas encore être prêt ou les champs différer légèrement.
      // Ou, si vous préférez, utilisez toujours les infos du token.
      setUser({ 
        email: userData.email, // Garder l'email de userData car il est direct
        roles: decodedToken.roles, 
        firstName: decodedToken.firstName // Prendre firstName du token
      }); 
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to decode JWT token on login:", error);
      // Gérer l'erreur, peut-être ne pas authentifier si le token est invalide
      localStorage.removeItem('jwtToken');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const logout = () => { // Rendre async si vous ajoutez des appels API plus tard
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 