import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon?: LucideIcon
  accent?: string
  delay?: number
}

export default function StatCard({ label, value, sub, icon: Icon, accent = 'var(--accent)', delay = 0 }: Props) {
  return (
    <div
      className="card fade-in"
      style={{
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 16,
          bottom: 16,
          width: 3,
          borderRadius: '0 3px 3px 0',
          background: accent,
          boxShadow: `0 0 12px ${accent}55`,
        }}
      />

      <div style={{ paddingLeft: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="label">{label}</span>
          {Icon && (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${accent}14`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={15} style={{ color: accent }} />
            </div>
          )}
        </div>

        <div className="stat-value">{value}</div>

        {sub && (
          <div style={{ marginTop: 6, fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}
