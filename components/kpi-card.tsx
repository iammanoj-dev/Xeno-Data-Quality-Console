import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  change: string
  icon: ReactNode
  trend: 'up' | 'down'
}

export default function KPICard({ title, value, change, icon, trend }: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-success" />
        ) : (
          <TrendingDown className="w-4 h-4 text-error" />
        )}
        <span className={trend === 'up' ? 'text-success' : 'text-error'}>{change}</span>
      </div>
    </div>
  )
}
