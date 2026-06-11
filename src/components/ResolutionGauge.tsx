import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

interface Props {
  rate: number
  delay?: number
}

export default function ResolutionGauge({ rate, delay = 0 }: Props) {
  const resolved = Math.round(rate)
  const unresolved = 100 - resolved
  const data = [
    { name: 'Resolved', value: resolved },
    { name: 'Unresolved', value: unresolved },
  ]

  return (
    <ChartCard label="Resolution Rate" delay={delay}>
      <div style={{ position: 'relative', height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={64}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="#2A4A5E" />
              <Cell fill="#f0f2f8" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {resolved}%
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--text-muted)', marginTop: 3 }}>
            Resolved
          </span>
        </div>
      </div>
    </ChartCard>
  )
}
