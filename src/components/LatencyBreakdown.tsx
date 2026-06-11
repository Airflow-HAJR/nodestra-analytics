import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ChartCard from './ChartCard'

interface Props {
  llmMs: number
  toolMs: number
  ttsMs: number
  delay?: number
}

export default function LatencyBreakdown({ llmMs, toolMs, ttsMs, delay = 0 }: Props) {
  const data = [
    { name: 'LLM', value: Math.round(llmMs), color: '#2A4A5E' },
    { name: 'Tool', value: Math.round(toolMs), color: '#4a7a9b' },
    { name: 'TTS', value: Math.round(ttsMs), color: '#9299b8' },
  ]

  return (
    <ChartCard label="Avg Latency Breakdown (ms / call)" delay={delay}>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#4a5278', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9299b8', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'linear-gradient(180deg, rgba(31,41,55,0.97), rgba(17,24,39,0.97))',
              border: 'none',
              borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
              padding: '8px 12px',
            }}
            labelStyle={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}
            itemStyle={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}
            formatter={(value: number) => [`${value}ms`, '']}
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} name="ms">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Inline stat row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginTop: 12,
      }}>
        {data.map(({ name, value, color }) => (
          <div key={name} style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color }}>{value.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>ms</div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
