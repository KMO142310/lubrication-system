'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Types
export type UserRole = 'desarrollador' | 'supervisor' | 'lubricador' | 'supervisor_ext';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    contractorId?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    loginWithPasskey: (email: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Fallback users para cuando no hay conexión a Supabase
const FALLBACK_USERS: (AuthUser & { password: string })[] = [
    {
        id: 'user-dev-1',
        email: 'dev@aisa.cl',
        password: 'dev2026!',
        name: 'Desarrollador AISA',
        role: 'desarrollador',
    },
    {
        id: 'user-sup-1',
        email: 'supervisor@aisa.cl',
        password: 'super123',
        name: 'Enrique Gonzáles M.',
        role: 'supervisor',
    },
    {
        id: 'user-lub-1',
        email: 'omar@aisa.cl',
        password: 'omar123',
        name: 'Omar Alexis',
        role: 'lubricador',
    },
    // Contratista Example
    {
        id: 'user-cont-1',
        email: 'juan@lubricacion.cl',
        password: 'tech123',
        name: 'Juan Pérez (Contratista)',
        role: 'supervisor_ext',
        contractorId: 'cont-123',
    }
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
        role: profile?.role || 'lubricador',
        contractorId: profile?.contractor_id,
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
                    // FORZAR LOGOUT si tiene rol antiguo (admin/tecnico)
                    if (parsedUser.role === 'admin' || parsedUser.role === 'tecnico') {
                        console.log('⚠️ Sesión con rol antiguo, forzando logout');
                        localStorage.removeItem(AUTH_STORAGE_KEY);
                        localStorage.removeItem('aisa_data_initialized_v12');
                        setUser(null);
                    } else {
                        setUser(parsedUser);
                    }
                } catch {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                }
            }
            setIsLoading(false);
        };

        initSession();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // 1. Intentar login con Supabase Auth primero (si hay conexión)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (data?.user && !error) {
                const authUser = await supabaseUserToAuthUser(data.user);
                setUser(authUser);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
                return { success: true };
            }
        } catch (_e) {
            console.log('Supabase auth failed, trying local fallback');
        }

        // 2. Fallback a usuarios locales (funciona offline)
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

    const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Google Auth Error:', error);
            return { success: false, error: error.message };
        }
    };

    const loginWithPasskey = async (email: string): Promise<{ success: boolean; error?: string }> => {
        // Implementación simulada de WebAuthn para MVP
        // En producción requeriría servidor FIDO2 real
        console.log('Initiating WebAuthn for:', email);

        // Simular éxito si es un usuario válido
        if (typeof window !== 'undefined' && window.PublicKeyCredential) {
            const foundUser = FALLBACK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (foundUser) {
                // Simulamos el challenge biométrico del OS
                const credential = await navigator.credentials.create({
                    publicKey: {
                        challenge: new Uint8Array(32),
                        rp: { name: "AISA Lubricación" },
                        user: {
                            id: new Uint8Array(16),
                            name: email,
                            displayName: foundUser.name
                        },
                        pubKeyCredParams: [{ alg: -7, type: "public-key" }]
                    }
                });

                if (credential) {
                    const { password: _, ...userWithoutPassword } = foundUser;
                    void _;
                    setUser(userWithoutPassword);
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
                    return { success: true };
                }
            }
        }

        return { success: false, error: 'Biometría no disponible o usuario no encontrado' };
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
                loginWithGoogle,
                loginWithPasskey,
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
