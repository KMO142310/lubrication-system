'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Types
export type UserRole = 'admin' | 'supervisor' | 'tecnico';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Fallback users para cuando no hay conexión a Supabase
const FALLBACK_USERS: (AuthUser & { password: string })[] = [
    {
        id: 'user-admin-1',
        email: 'omar@aisa.cl',
        password: 'admin123',
        name: 'Omar Alexis',
        role: 'admin',
    },
    {
        id: 'user-sup-1',
        email: 'supervisor@aisa.cl',
        password: 'super123',
        name: 'Carlos Muñoz',
        role: 'supervisor',
    },
    {
        id: 'user-tech-1',
        email: 'tecnico@aisa.cl',
        password: 'tech123',
        name: 'Juan Pérez',
        role: 'tecnico',
    },
];

const AUTH_STORAGE_KEY = 'aisa_auth_session';

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper para convertir Supabase User a AuthUser
async function supabaseUserToAuthUser(supabaseUser: User): Promise<AuthUser> {
    // Intentar obtener el perfil de la DB
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
    
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
        role: profile?.role || 'tecnico',
    };
}

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializar sesión - SOLO desde localStorage (funciona offline)
    useEffect(() => {
        const initSession = () => {
            // Cargar sesión guardada de localStorage
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            if (stored) {
                try {
                    const parsedUser = JSON.parse(stored);
                    setUser(parsedUser);
                } catch {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                }
            }
            setIsLoading(false);
        };

        initSession();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Login con usuarios locales (funciona offline)
        const foundUser = FALLBACK_USERS.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            void _;
            setUser(userWithoutPassword);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
            return { success: true };
        }

        return { success: false, error: 'Credenciales inválidas' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Permission helpers
export function canAccess(role: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(role);
}

export function isAdmin(role: UserRole): boolean {
    return role === 'admin';
}

export function isAdminOrSupervisor(role: UserRole): boolean {
    return role === 'admin' || role === 'supervisor';
}
