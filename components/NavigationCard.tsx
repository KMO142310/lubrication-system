import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface NavigationCardProps {
    href: string;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    color: string; // Hex basic color, e.g., "#f59e0b"
    bgColorRgba: string; // e.g., "rgba(245, 158, 11, 0.1)"
}

export default function NavigationCard({ href, title, subtitle, icon: Icon, color, bgColorRgba }: NavigationCardProps) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '8px',
            background: bgColorRgba,
            border: `1px solid ${color}33`, // 20% opacity approx
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            textDecoration: 'none'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, // Slight gradient
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Icon style={{ width: 18, height: 18, color: '#0f172a' }} />
            </div>
            <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{subtitle}</div>
            </div>
        </Link>
    );
}
