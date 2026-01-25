'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState, useEffect, useRef } from 'react';
import {
    Menu,
    X,
    ChevronRight,
    LogOut,
} from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import { NAVIGATION_CONFIG } from '@/lib/navigation';

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
                                    {user?.contractorId ? 'Contratista' : (user?.role === 'desarrollador' ? 'Desarrollador' : user?.role === 'supervisor' ? 'Supervisor' : 'Lubricador')}
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
                    {NAVIGATION_CONFIG.map((section) => {
                        const visibleItems = section.items.filter(item =>
                            user && item.roles.includes(user.role)
                        );

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={section.group} className="nav-section">
                                <span className="nav-section-title">{section.group}</span>
                                {visibleItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`nav-item ${isActive ? 'active' : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className="nav-icon" />
                                            <span>{item.label}</span>
                                            {isActive && <ChevronRight className="nav-chevron" style={{ marginLeft: 'auto', width: 16, height: 16 }} />}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
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
