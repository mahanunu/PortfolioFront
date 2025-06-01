'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface User {
  email?: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Logique de login à affiner selon le retour de l'API
  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Potentiellement stocker un indicateur de session dans localStorage/sessionStorage si nécessaire,
    // mais s'appuyer principalement sur le cookie de session HTTPOnly pour la sécurité.
  };

  const logout = () => {
    // Logique de déconnexion : appeler l'API de déconnexion, effacer l'état
    setIsAuthenticated(false);
    setUser(null);
    // Potentiellement effacer des items du localStorage/sessionStorage
    // Exemple : appeler l'API /logout du backend
    fetch('/logout', { method: 'POST' }) // Assurez-vous que cette route existe et fonctionne
      .then(response => {
        if(response.ok) {
          console.log("Déconnexion réussie côté serveur");
        }
      })
      .catch(error => console.error("Erreur lors de la déconnexion serveur:", error));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, login, logout }}>
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