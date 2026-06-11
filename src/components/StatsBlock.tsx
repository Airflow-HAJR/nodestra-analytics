import { Phone, Clock, CheckCircle, Users } from 'lucide-react'

interface Props {
  totalCalls: number
  avgDuration: number
  resolutionRate: number
  totalUsers: number
  delay?: number
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m > 0 ? `${m}m ${sec}s` : `${s.toFixed(1)}s`
}

const CELLS = [
  { label: 'Total Calls', accent: '#2A4A5E', Icon: Phone },
  { label: 'Resolution Rate', accent: '#22c55e', Icon: CheckCircle },
  { label: 'Avg Duration', accent: '#4a7a9b', Icon: Clock },
  { label: 'Users', accent: '#9299b8', Icon: Users },
]

export default function StatsBlock({ totalCalls, avgDuration, resolutionRate, totalUsers, delay = 0 }: Props) {
  const values = [
    totalCalls.toLocaleString(),
    `${Math.round(resolutionRate)}%`,
    fmtDuration(avgDuration),
    totalUsers.toLocaleString(),
  ]
  const subs = [
    'total conversations',
    `${Math.round(totalCalls * resolutionRate / 100)} resolved`,
    'per call',
    'unique visitors',
  ]

  return (
    <div
      className="fade-in"
      style={{
        animationDelay: `${delay}ms`,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        background: 'var(--bg-surface)',
        borderRadius: 14,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      {CELLS.map((cell, i) => (
        <div
          key={cell.label}
          style={{
            padding: '18px 20px 16px',
            borderRight: i < 3 ? '1px solid rgba(0,0,0,0.07)' : undefined,
            position: 'relative',
            background: `linear-gradient(135deg, ${cell.accent}06 0%, transparent 60%)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              {cell.label}
            </span>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: `${cell.accent}14`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <cell.Icon size={12} style={{ color: cell.accent }} />
            </div>
          </div>

          <div style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: 5,
          }}>
            {values[i]}
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
            {subs[i]}
          </div>

          {/* Bottom accent bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 20,
            right: 20,
            height: 2,
            borderRadius: '2px 2px 0 0',
            background: `linear-gradient(90deg, ${cell.accent}40, ${cell.accent}00)`,
          }} />
        </div>
      ))}

      {/* Connector nodes at each divider */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          left: `${i * 25}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--bg-surface)',
          border: '1.5px solid rgba(0,0,0,0.10)',
          boxShadow: '0 0 0 3px rgba(42,74,94,0.05)',
          zIndex: 2,
        }} />
      ))}
    </div>
  )
}
