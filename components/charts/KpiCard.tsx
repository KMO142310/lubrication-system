import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = '#D4740E',
}: KpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#38A169' : trend === 'down' ? '#E53E3E' : '#A0AEC0';

  return (
    <div
      className="rounded-sm p-4 space-y-2"
      style={{
        backgroundColor: '#2D3748',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="flex items-center justify-between">
        <Icon className="w-5 h-5" style={{ color }} />
        {trend && (
          <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
        )}
      </div>
      <p className="font-bold text-white" style={{ fontSize: '28px' }}>
        {value}
      </p>
      <p style={{ color: '#A0AEC0', fontSize: '14px' }}>
        {title}
      </p>
      {subtitle && (
        <p style={{ color: '#A0AEC0', fontSize: '12px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
