import {
    LayoutDashboard,
    ClipboardCheck,
    AlertTriangle,
    BarChart3,
    Database,
    Users,
    Settings,
    History,
    Shield,
    Calendar,
    Package,
    Map,
    LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
    label: string;
    icon: LucideIcon;
    href: string;
    roles: string[];
}

export interface NavGroupConfig {
    group: string;
    items: NavItemConfig[];
}

export const NAVIGATION_CONFIG: NavGroupConfig[] = [
    {
        group: 'Principal',
        items: [
            { label: 'Panel Admin', icon: LayoutDashboard, href: '/admin', roles: ['desarrollador'] },
            { label: 'Panel Supervisor', icon: Shield, href: '/supervisor', roles: ['desarrollador', 'supervisor', 'supervisor_ext'] },
            { label: 'Mi Dashboard', icon: ClipboardCheck, href: '/', roles: ['lubricador'] }, // Tech view
            { label: 'Vista Técnico', icon: Users, href: '/', roles: ['desarrollador', 'supervisor'] }, // Allow them to see tech view
            { label: 'Mis Tareas', icon: ClipboardCheck, href: '/tasks', roles: ['lubricador'] },
            { label: 'Tareas Equipo', icon: ClipboardCheck, href: '/tasks', roles: ['desarrollador', 'supervisor', 'supervisor_ext'] },
            { label: 'Historial', icon: History, href: '/historial', roles: ['desarrollador', 'supervisor', 'lubricador', 'supervisor_ext'] },
            { label: 'Planificación', icon: Calendar, href: '/schedule', roles: ['desarrollador', 'supervisor', 'supervisor_ext'] },
            { label: 'Indicadores', icon: BarChart3, href: '/metrics', roles: ['desarrollador', 'supervisor'] }, // Contractors don't see full metrics yet
        ]
    },
    {
        group: 'Gestión',
        items: [
            { label: 'Activos', icon: Database, href: '/assets', roles: ['desarrollador', 'supervisor', 'supervisor_ext'] }, // They see their allocated assets
            { label: 'Planos', icon: Map, href: '/plans', roles: ['desarrollador', 'supervisor', 'lubricador', 'supervisor_ext'] },
            { label: 'Anomalías', icon: AlertTriangle, href: '/anomalies', roles: ['desarrollador', 'supervisor', 'lubricador', 'supervisor_ext'] },
            { label: 'Inventario', icon: Package, href: '/inventory', roles: ['desarrollador', 'supervisor'] },
            { label: 'Contratistas', icon: Users, href: '/contractors', roles: ['desarrollador', 'supervisor'] },
        ]
    },
    {
        group: 'Sistema',
        items: [
            { label: 'Alertas', icon: Shield, href: '/admin/alertas', roles: ['desarrollador', 'supervisor'] },
            { label: 'Audit Cycle', icon: Shield, href: '/audit-cycle', roles: ['desarrollador'] },
            { label: 'Evolution Cycle', icon: BarChart3, href: '/evolution-cycle', roles: ['desarrollador'] },
            { label: 'Usuarios', icon: Users, href: '/users', roles: ['desarrollador'] },
            { label: 'Configuración', icon: Settings, href: '/admin', roles: ['desarrollador'] },
        ]
    }
];
