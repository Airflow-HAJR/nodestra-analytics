import type { ReactNode } from 'react'
import SectionLabel from './SectionLabel'

interface Props {
  label: string
  children: ReactNode
  className?: string
  delay?: number
  action?: ReactNode
}

export default function ChartCard({ label, children, className = '', delay = 0, action }: Props) {
  return (
    <div
      className={`card fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionLabel>{label}</SectionLabel>
        {action}
      </div>
      {children}
    </div>
  )
}
