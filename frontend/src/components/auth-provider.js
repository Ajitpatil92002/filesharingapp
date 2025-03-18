'use client';

import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
    token: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false,
});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isLoaded, setIsLoaded] = useState();
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoaded(true);
    }, []);

    const login = newToken => {
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        router.refresh();
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        router.refresh();
    };
    if (!isLoaded) {
        return null;
    }
    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated: token ? true : false,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
