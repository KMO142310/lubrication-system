'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type UserRole = 'admin' | 'supervisor' | 'tecnico';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    companyId: string;
    companyName: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Demo users for local authentication
const DEMO_USERS: (AuthUser & { password: string })[] = [
    {
        id: 'user-admin-1',
        email: 'omar@aisa.cl',
        password: 'admin123',
        name: 'Omar Alexis',
        role: 'admin',
        companyId: 'aisa',
        companyName: 'AISA',
    },
    {
        id: 'user-sup-1',
        email: 'supervisor@aisa.cl',
        password: 'super123',
        name: 'Carlos Muñoz',
        role: 'supervisor',
        companyId: 'aisa',
        companyName: 'AISA',
    },
    {
        id: 'user-tech-1',
        email: 'juan@lubricacion.cl',
        password: 'tech123',
        name: 'Juan Pérez',
        role: 'tecnico',
        companyId: 'lub-pro',
        companyName: 'Lubricación Profesional Ltda.',
    },
    {
        id: 'user-tech-2',
        email: 'pedro@lubricacion.cl',
        password: 'tech123',
        name: 'Pedro González',
        role: 'tecnico',
        companyId: 'lub-pro',
        companyName: 'Lubricación Profesional Ltda.',
    },
];

const AUTH_STORAGE_KEY = 'aisa_auth_session';

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(true);

    // Mark loading complete after initial render
    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const found = DEMO_USERS.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
            return { success: false, error: 'Credenciales inválidas' };
        }

        const { password: _, ...userWithoutPassword } = found;
void _; // Explicitly mark as intentionally unused
        setUser(userWithoutPassword);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));

        return { success: true };
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
