interface Props {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className = '' }: Props) {
  return (
    <span
      className={className}
      style={{
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.10em',
        color: 'var(--text-muted)',
      }}
    >
      {children}
    </span>
  )
}
