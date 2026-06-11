import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ChartCard from './ChartCard'

interface Props {
  data: { topic: string; count: number }[]
  delay?: number
}

const COLORS = [
  '#2A4A5E', '#3d6b84', '#4a7a9b', '#5a8fab', '#6aa1be',
  '#7ab0cc', '#8abfda', '#9acde7', '#aadaf2', '#bacfe8',
  '#c9c4de', '#d8b9d4',
]

const LABELS: Record<string, string> = {
  directions: 'Directions',
  gate_query: 'Gate Info',
  general_info: 'General Info',
  restroom: 'Restroom',
  flight_status: 'Flight Status',
  unresolved: 'Unresolved',
  food: 'Food & Dining',
  amenities: 'Amenities',
  accessibility: 'Accessibility',
}

function formatTopic(key: string): string {
  return LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function TopicsChart({ data, delay = 0 }: Props) {
  const formatted = data.map(d => ({ ...d, label: formatTopic(d.topic) }))
  const height = Math.max(220, formatted.length * 34)

  return (
    <ChartCard label="Most Common Topics" delay={delay}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: '#9299b8', fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: '#4a5278', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={110}
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
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Mentions">
            {formatted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
