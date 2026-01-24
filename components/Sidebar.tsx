'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    ClipboardCheck,
    Calendar,
    BarChart3,
    Database,
    AlertTriangle,
    Package,
    Settings,
    LogOut,
    ChevronRight,
    Users,
    Menu,
    X,
    History,
    Shield,
} from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const prevPathname = useRef(pathname);

    // Close sidebar on route change
    useEffect(() => {
        if (prevPathname.current !== pathname) {
            prevPathname.current = pathname;
            setIsOpen(false);
        }
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Navigation items vary by role
    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['lubricador'] },
        { name: 'Panel Supervisor', href: '/supervisor', icon: Shield, roles: ['desarrollador', 'supervisor'] },
        { name: 'Mis Tareas', href: '/tasks', icon: ClipboardCheck, roles: ['lubricador'] },
        { name: 'Tareas Equipo', href: '/tasks', icon: ClipboardCheck, roles: ['desarrollador', 'supervisor'] },
        { name: 'Historial', href: '/historial', icon: History, roles: ['desarrollador', 'supervisor', 'lubricador'] },
        { name: 'Planificación', href: '/schedule', icon: Calendar, roles: ['desarrollador', 'supervisor'] },
        { name: 'Indicadores', href: '/metrics', icon: BarChart3, roles: ['desarrollador', 'supervisor'] },
    ];

    const management = [
        { name: 'Activos', href: '/assets', icon: Database, roles: ['desarrollador', 'supervisor'] },
        { name: 'Anomalías', href: '/anomalies', icon: AlertTriangle, roles: ['desarrollador', 'supervisor', 'lubricador'] },
        { name: 'Inventario', href: '/inventory', icon: Package, roles: ['desarrollador', 'supervisor'] },
        { name: 'Contratistas', href: '/contractors', icon: Users, roles: ['desarrollador'] },
    ];

    const system = [
        { name: 'Alertas', href: '/admin/alertas', icon: Shield, roles: ['desarrollador', 'supervisor'] },
        { name: 'Usuarios', href: '/users', icon: Users, roles: ['desarrollador'] },
        { name: 'Configuración', href: '/admin', icon: Settings, roles: ['desarrollador'] },
    ];

    const filterByRole = (items: typeof navigation) => {
        if (!user) return [];
        return items.filter(item => item.roles.includes(user.role));
    };

    return (
        <>
            {/* Mobile Header Trigger */}
            <div className="mobile-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg ml-2">AISA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ConnectionStatus />
                    <button
                        className="btn-icon btn-ghost"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu style={{ width: 24, height: 24 }} />
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div className="sidebar-logo-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div className="sidebar-logo-text">
                                <span className="sidebar-logo-title">AISA Lubricación</span>
                                <span className="sidebar-logo-subtitle">
                                    {user?.role === 'desarrollador' ? 'Desarrollador' : user?.role === 'supervisor' ? 'Supervisor' : 'Lubricador'}
                                </span>
                            </div>
                        </div>
                        {isOpen && (
                            <button className="btn-icon btn-ghost" onClick={() => setIsOpen(false)}>
                                <X style={{ width: 20, height: 20 }} />
                            </button>
                        )}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">Principal</span>
                        {filterByRole(navigation).map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="nav-icon" />
                                    <span>{item.name}</span>
                                    {isActive && <ChevronRight className="nav-chevron" style={{ marginLeft: 'auto', width: 16, height: 16 }} />}
                                </Link>
                            );
                        })}
                    </div>

                    {filterByRole(management).length > 0 && (
                        <div className="nav-section">
                            <span className="nav-section-title">Gestión</span>
                            {filterByRole(management).map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className="nav-icon" />
                                        <span>{item.name}</span>
                                        {isActive && <ChevronRight className="nav-chevron" style={{ marginLeft: 'auto', width: 16, height: 16 }} />}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {filterByRole(system).length > 0 && (
                        <div className="nav-section">
                            <span className="nav-section-title">Sistema</span>
                            {filterByRole(system).map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className="nav-icon" />
                                        <span>{item.name}</span>
                                        {isActive && <ChevronRight className="nav-chevron" style={{ marginLeft: 'auto', width: 16, height: 16 }} />}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-card">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'Usuario'}</span>
                            <span className="user-role">{user?.role || ''}</span>
                        </div>
                        <button
                            className="btn-icon sm btn-ghost"
                            aria-label="Cerrar sesión"
                            onClick={handleLogout}
                            title="Cerrar sesión"
                        >
                            <LogOut style={{ width: 16, height: 16 }} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
