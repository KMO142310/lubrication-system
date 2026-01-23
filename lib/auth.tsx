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

    // Inicializar sesión
    useEffect(() => {
        const initSession = async () => {
            try {
                // Verificar sesión de Supabase
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    const authUser = await supabaseUserToAuthUser(session.user);
                    setUser(authUser);
                } else {
                    // Intentar cargar de localStorage (fallback)
                    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
                    if (stored) {
                        try {
                            setUser(JSON.parse(stored));
                        } catch {
                            localStorage.removeItem(AUTH_STORAGE_KEY);
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing session:', error);
                // Fallback a localStorage
                const stored = localStorage.getItem(AUTH_STORAGE_KEY);
                if (stored) {
                    try {
                        setUser(JSON.parse(stored));
                    } catch {
                        localStorage.removeItem(AUTH_STORAGE_KEY);
                    }
                }
            }
            setIsLoading(false);
        };

        initSession();

        // Escuchar cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const authUser = await supabaseUserToAuthUser(session.user);
                setUser(authUser);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // Intentar login con Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (data?.user) {
                const authUser = await supabaseUserToAuthUser(data.user);
                setUser(authUser);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
                return { success: true };
            }

            if (error) {
                // Si Supabase falla, intentar con usuarios de fallback
                const fallbackUser = FALLBACK_USERS.find(
                    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                );

                if (fallbackUser) {
                    const { password: _, ...userWithoutPassword } = fallbackUser;
                    void _;
                    setUser(userWithoutPassword);
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
                    return { success: true };
                }

                return { success: false, error: error.message || 'Credenciales inválidas' };
            }

            return { success: false, error: 'Error desconocido' };
        } catch (err) {
            // Fallback sin conexión
            const fallbackUser = FALLBACK_USERS.find(
                u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (fallbackUser) {
                const { password: _, ...userWithoutPassword } = fallbackUser;
                void _;
                setUser(userWithoutPassword);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
                return { success: true };
            }

            return { success: false, error: 'Error de conexión' };
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
