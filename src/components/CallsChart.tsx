import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import ChartCard from './ChartCard'

interface Props {
  data: { date: string; count: number }[]
  delay?: number
}

function formatDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function CallsChart({ data, delay = 0 }: Props) {
  const formatted = data.map(d => ({ ...d, label: formatDate(d.date) }))

  return (
    <ChartCard label="Calls per Day" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2A4A5E" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2A4A5E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#9299b8', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9299b8', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
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
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#2A4A5E"
            strokeWidth={2}
            fill="url(#callGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#2A4A5E', stroke: '#fff', strokeWidth: 2 }}
            name="Calls"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
