import { Users } from 'lucide-react'
import ChartCard from './ChartCard'

interface Props {
  returningUsers: number
  totalUsers: number
  delay?: number
}

export default function UserMemoryCard({ returningUsers, totalUsers, delay = 0 }: Props) {
  const pct = totalUsers ? Math.round((returningUsers / totalUsers) * 100) : 0
  const newUsers = totalUsers - returningUsers

  return (
    <ChartCard label="User Memory" delay={delay}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Total users headline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(42,74,94,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Users size={18} style={{ color: '#2A4A5E' }} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
              {totalUsers.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 2 }}>
              Total Users
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>Returning ({pct}%)</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{returningUsers.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #2A4A5E, #4a7a9b)',
              borderRadius: 999,
              transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{
            background: 'rgba(42,74,94,0.07)',
            border: '1px solid rgba(42,74,94,0.12)',
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#2A4A5E', letterSpacing: '-0.02em' }}>{returningUsers.toLocaleString()}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2A4A5E', opacity: 0.7, marginTop: 2 }}>Returning</div>
          </div>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '-0.02em' }}>{newUsers.toLocaleString()}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 2 }}>New</div>
          </div>
        </div>
      </div>
    </ChartCard>
  )
}
