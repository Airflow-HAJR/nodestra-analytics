import { useEffect, useRef } from 'react'
import { useSpring, useTrail, animated } from '@react-spring/web'
import { X, BarChart2, Map, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  active?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Analytics', href: '/', icon: BarChart2 },
  { label: 'Map Builder', href: 'https://map.nodestra.com', icon: Map },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function NavigationOverlay({ isOpen, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateX(0%)' : 'translateX(-100%)',
    config: { tension: 280, friction: 26 },
  })

  const trail = useTrail(NAV_ITEMS.length, {
    opacity: isOpen ? 1 : 0,
    x: isOpen ? 0 : -40,
    delay: isOpen ? 100 : 0,
    config: { tension: 300, friction: 28 },
  })

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = import.meta.env.VITE_SIGNIN_URL ?? 'https://signin.nodestra.com'
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(10,14,20,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
      }}
    >
      <animated.div
        style={{
          ...overlaySpring,
          width: 320,
          height: '100%',
          background: '#0b1520',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 0',
          boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Diamond logo mark */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#4a7a9b" />
              <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="#2A4A5E" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Workspace
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {trail.map(({ opacity, x }, i) => {
            const item = NAV_ITEMS[i]
            const isActive = item.href === '/' && window.location.pathname === '/'
            return (
              <animated.a
                key={item.label}
                href={item.href}
                style={{
                  opacity,
                  transform: x.to(v => `translateX(${v}px)`),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  background: isActive ? 'rgba(42,74,94,0.3)' : 'transparent',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {isActive && (
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4a7a9b', flexShrink: 0 }} />
                )}
                <item.icon size={18} style={{ color: isActive ? '#7ab0cc' : 'rgba(255,255,255,0.35)', flexShrink: 0, marginLeft: isActive ? 0 : 19 }} />
                <span style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                  {item.label}
                </span>
              </animated.a>
            )
          })}
        </nav>

        {/* Footer: sign out */}
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              borderRadius: 10,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={15} style={{ color: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>Sign out</span>
          </button>
        </div>
      </animated.div>
    </div>
  )
}
