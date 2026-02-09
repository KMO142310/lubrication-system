'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  MapPin,
  Cog,
  Droplet,
  Target,
  Route,
  ClipboardList,
  Users,
  AlertTriangle,
  Package,
  FileText,
  Lightbulb,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/(supervisor)/dashboard', icon: LayoutDashboard },
  { name: 'Áreas', href: '/(supervisor)/areas', icon: MapPin },
  { name: 'Máquinas', href: '/(supervisor)/machines', icon: Cog },
  { name: 'Lubricantes', href: '/(supervisor)/lubricants', icon: Droplet },
  { name: 'Puntos', href: '/(supervisor)/points', icon: Target },
  { name: 'Rutas', href: '/(supervisor)/routes', icon: Route },
  { name: 'Órdenes de Trabajo', href: '/(supervisor)/work-orders', icon: ClipboardList },
  { name: 'Personal', href: '/(supervisor)/workers', icon: Users },
  { name: 'Incidentes', href: '/(supervisor)/incidents', icon: AlertTriangle },
  { name: 'Inventario', href: '/(supervisor)/inventory', icon: Package },
  { name: 'Reportes', href: '/(supervisor)/reports', icon: FileText },
  { name: 'Insights', href: '/(supervisor)/insights', icon: Lightbulb },
];

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1419' }}>
      <aside
        className="fixed left-0 top-0 h-full flex flex-col"
        style={{ width: '256px', backgroundColor: '#1B2A4A' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(212, 116, 14, 0.2)' }}>
          <h1 className="text-2xl font-bold" style={{ color: '#D4740E' }}>
            BITACORA
          </h1>
          <p className="text-xs mt-1" style={{ color: '#A0AEC0' }}>
            Sistema de Lubricación
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-sm transition-colors hover:bg-opacity-10"
                    style={{
                      color: '#A0AEC0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(212, 116, 14, 0.1)';
                      e.currentTarget.style.color = '#D4740E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#A0AEC0';
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(212, 116, 14, 0.2)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-sm transition-colors"
            style={{ color: '#A0AEC0' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
              e.currentTarget.style.color = '#E53E3E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A0AEC0';
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="pl-64 p-8">
        {children}
      </main>
    </div>
  );
}
