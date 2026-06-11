import ChartCard from './ChartCard'
import SectionLabel from './SectionLabel'

interface AirportRow {
  airport: string
  calls: number
  resolved: number
  avgDuration: number
}

interface Props {
  data: AirportRow[]
  delay?: number
}

function pct(n: number, d: number) {
  if (!d) return '—'
  return `${Math.round((n / d) * 100)}%`
}

function fmtDuration(s: number) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

export default function AirportBreakdown({ data, delay = 0 }: Props) {
  if (data.length <= 1) return null

  const maxCalls = Math.max(...data.map(d => d.calls), 1)

  return (
    <ChartCard label="Per-Airport Breakdown" delay={delay} className="card-lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 80px 80px 120px',
          gap: 8,
          paddingBottom: 8,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          {['Airport', 'Calls', 'Resolved', 'Res. Rate', 'Avg Duration'].map(h => (
            <SectionLabel key={h}>{h}</SectionLabel>
          ))}
        </div>

        {data.map((row) => (
          <div
            key={row.airport}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px 80px 120px',
              gap: 8,
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            {/* Airport + bar */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {row.airport}
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(row.calls / maxCalls) * 100}%`,
                  background: '#2A4A5E',
                  borderRadius: 2,
                  transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{row.calls.toLocaleString()}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>{row.resolved.toLocaleString()}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>{pct(row.resolved, row.calls)}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>{fmtDuration(row.avgDuration)}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
