'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Interface pour les erreurs de validation par champ
interface FieldErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    general?: string; // Pour les erreurs non spécifiques à un champ
}

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({}); // Utiliser l'interface FieldErrors
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({}); // Réinitialiser les erreurs

        try {
            const response = await fetch('/api/users', { // L'URL est relative, Next.js la préfixera correctement
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Important pour API Platform
                },
                body: JSON.stringify({ firstName, lastName, email, plainPassword: password }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const newErrors: FieldErrors = {};
                if (responseData.violations) {
                    responseData.violations.forEach((violation: { propertyPath: string; message: string }) => {
                        // Mapper propertyPath aux champs du formulaire
                        // API Platform peut renvoyer 'plainPassword' pour le mot de passe
                        if (violation.propertyPath === 'firstName') newErrors.firstName = violation.message;
                        else if (violation.propertyPath === 'lastName') newErrors.lastName = violation.message;
                        else if (violation.propertyPath === 'email') newErrors.email = violation.message;
                        else if (violation.propertyPath === 'plainPassword') newErrors.password = violation.message;
                        else {
                            newErrors.general = (newErrors.general ? newErrors.general + " " : "") + violation.message;
                        }
                    });
                } else if (responseData.message) { // Hydra error (plus générique)
                    newErrors.general = responseData.message;
                } else if (responseData.detail) { // Autre format d'erreur API Platform
                     newErrors.general = responseData.detail;
                } else {
                    newErrors.general = 'Une erreur est survenue lors de l\'inscription.';
                }
                setErrors(newErrors);
                throw new Error('Validation failed or server error'); // Déclenche le catch
            }
            
            // Enregistrement réussi
            router.push('/login'); // Rediriger vers la page de connexion

        } catch (err: any) {
            // Les erreurs spécifiques sont déjà dans `errors`
            // Si `errors` est vide et qu'une erreur s'est produite (ex: erreur réseau), afficher un message générique
            if (Object.keys(errors).length === 0 && !errors.general) {
                 setErrors({ general: err.message || 'Une erreur inattendue est survenue.' });
            }
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', margin: 0 }}>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>Inscription</h1>
                {errors.general && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{errors.general}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Prénom :</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: errors.firstName ? '1px solid red' : '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        {errors.firstName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.firstName}</p>}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Nom :</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: errors.lastName ? '1px solid red' : '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        {errors.lastName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.lastName}</p>}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Email :</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: errors.email ? '1px solid red' : '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        {errors.email && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 'bold' }}>Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: errors.password ? '1px solid red' : '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        {errors.password && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.password}</p>}
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: isLoading ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 