interface Props {
  data: { dayOfWeek: number; hour: number; count: number }[]
  delay?: number
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

function getColor(count: number, max: number): string {
  if (count === 0) return 'rgba(42,74,94,0.07)'
  const t = Math.pow(count / max, 0.6)
  return `rgba(42,74,94,${(0.2 + t * 0.75).toFixed(2)})`
}

function formatHour(h: number): string {
  if (h === 0) return '12a'
  if (h < 12) return `${h}a`
  if (h === 12) return '12p'
  return `${h - 12}p`
}

export default function ActivityHeatmap({ data, delay = 0 }: Props) {
  const countMap = new Map<string, number>()
  let maxCount = 0
  for (const d of data) {
    const bucket = Math.floor(d.hour / 2) * 2
    const key = `${d.dayOfWeek}-${bucket}`
    const val = (countMap.get(key) ?? 0) + d.count
    countMap.set(key, val)
    if (val > maxCount) maxCount = val
  }

  const hours = data.length > 0
    ? Array.from(new Set(data.map(d => Math.floor(d.hour / 2) * 2))).sort((a, b) => a - b)
    : []

  const topSlots = Array.from(countMap.entries())
    .map(([key, count]) => { const [day, hour] = key.split('-').map(Number); return { day, hour, count } })
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="card fade-in" style={{ animationDelay: `${delay}ms`, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Grid section */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            Activity by Time
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>Less</span>
            {[0.07, 0.25, 0.48, 0.7, 0.9].map((o, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: `rgba(42,74,94,${o})` }} />
            ))}
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>More</span>
          </div>
        </div>

        {hours.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>No data yet</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(7, 30px)', gap: 4, marginBottom: 4 }}>
              <div />
              {DAYS.map(day => (
                <div key={day} style={{ textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {day[0]}
                </div>
              ))}
            </div>
            {hours.map(hour => (
              <div key={hour} style={{ display: 'grid', gridTemplateColumns: '28px repeat(7, 30px)', gap: 4, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 5, fontSize: 9, fontWeight: 500, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatHour(hour)}
                </div>
                {DAY_ORDER.map(dayOfWeek => {
                  const count = countMap.get(`${dayOfWeek}-${hour}`) ?? 0
                  return (
                    <div
                      key={dayOfWeek}
                      title={count > 0 ? `${count} call${count !== 1 ? 's' : ''}` : undefined}
                      style={{ width: 30, height: 30, borderRadius: 6, background: getColor(count, maxCount) }}
                    />
                  )
                })}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Peak times panel */}
      {topSlots.length > 0 && (
        <div style={{ flex: 1, borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: 24, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            Peak Times
          </span>
          {topSlots.map((slot, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', width: 52, flexShrink: 0 }}>
                {DAY_NAMES[slot.day]} {formatHour(slot.hour)}
              </span>
              <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#f0f2f8', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(slot.count / maxCount) * 100}%`, borderRadius: 3, background: `rgba(42,74,94,${0.35 + (1 - i / topSlots.length) * 0.55})` }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', width: 16, textAlign: 'right' }}>
                {slot.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
