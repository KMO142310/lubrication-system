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
} from 'lucide-react';

export interface NavItemConfig {
    label: string;
    icon: any;
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
            { label: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['lubricador'] },
            { label: 'Panel Supervisor', icon: Shield, href: '/supervisor', roles: ['desarrollador', 'supervisor'] },
            { label: 'Mis Tareas', icon: ClipboardCheck, href: '/tasks', roles: ['lubricador'] },
            { label: 'Tareas Equipo', icon: ClipboardCheck, href: '/tasks', roles: ['desarrollador', 'supervisor'] },
            { label: 'Historial', icon: History, href: '/historial', roles: ['desarrollador', 'supervisor', 'lubricador'] },
            { label: 'Planificación', icon: Calendar, href: '/schedule', roles: ['desarrollador', 'supervisor'] },
            { label: 'Indicadores', icon: BarChart3, href: '/metrics', roles: ['desarrollador', 'supervisor'] },
        ]
    },
    {
        group: 'Gestión',
        items: [
            { label: 'Activos', icon: Database, href: '/assets', roles: ['desarrollador', 'supervisor'] },
            { label: 'Anomalías', icon: AlertTriangle, href: '/anomalies', roles: ['desarrollador', 'supervisor', 'lubricador'] },
            { label: 'Inventario', icon: Package, href: '/inventory', roles: ['desarrollador', 'supervisor'] },
            { label: 'Contratistas', icon: Users, href: '/contractors', roles: ['desarrollador'] },
        ]
    },
    {
        group: 'Sistema',
        items: [
            { label: 'Alertas', icon: Shield, href: '/admin/alertas', roles: ['desarrollador', 'supervisor'] },
            { label: 'Usuarios', icon: Users, href: '/users', roles: ['desarrollador'] },
            { label: 'Configuración', icon: Settings, href: '/admin', roles: ['desarrollador'] },
        ]
    }
];
