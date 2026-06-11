import { useState, useEffect } from 'react'
import { Phone, RefreshCw, AlertCircle, Mic2, MessageSquare, Menu } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'
import { useAuth } from '../hooks/useAuth'
import StatsBlock from '../components/StatsBlock'
import ActivityHeatmap from '../components/ActivityHeatmap'
import ResolutionGauge from '../components/ResolutionGauge'
import TopicsChart from '../components/TopicsChart'
import ToolsChart from '../components/ToolsChart'
import LatencyBreakdown from '../components/LatencyBreakdown'
import AirportBreakdown from '../components/AirportBreakdown'
import UserMemoryCard from '../components/UserMemoryCard'
import VoiceModal from '../components/VoiceModal'
import NavigationOverlay from '../components/NavigationOverlay'
import type { ElevenLabsVoice } from '../lib/elevenlabs'

const isDev = import.meta.env.DEV

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const data = useAnalytics()
  const [navOpen, setNavOpen] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(null)

  useEffect(() => {
    if (!isDev && !authLoading && !user) {
      window.location.href = import.meta.env.VITE_SIGNIN_URL ?? 'https://signin.nodestra.com'
    }
  }, [isDev, user, authLoading])

  if (authLoading) return null
  if (!isDev && !user) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      padding: '0 0 40px',
    }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(245,246,250,0.98), rgba(245,246,250,0.92))',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: menu + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setNavOpen(true)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.07)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              marginRight: 2,
            }}
          >
            <Menu size={14} />
          </button>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: '#2A4A5E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Phone size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Nodestra
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            marginLeft: 2,
          }}>
            Analytics
          </span>
        </div>

        {/* Right: actions + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Voice picker button */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 14px',
              background: selectedVoice ? '#2A4A5E' : 'var(--bg-surface)',
              border: selectedVoice ? 'none' : '1px solid rgba(0,0,0,0.07)',
              borderRadius: 999,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Mic2 size={12} style={{ color: selectedVoice ? '#fff' : 'var(--text-muted)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: selectedVoice ? '#fff' : 'var(--text-secondary)' }}>
              {selectedVoice ? selectedVoice.name : 'Voice'}
            </span>
          </button>

          {/* Status pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 999,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            {data.loading ? (
              <>
                <RefreshCw size={12} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Loading…</span>
              </>
            ) : data.error ? (
              <>
                <AlertCircle size={12} style={{ color: 'var(--error)' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--error)' }}>Error loading data</span>
              </>
            ) : (
              <>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Live · {data.totalCalls.toLocaleString()} calls
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Selected voice banner */}
      {selectedVoice && (
        <div style={{
          background: '#2A4A5E',
          padding: '8px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <Mic2 size={12} color="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Active Voice
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{selectedVoice.name}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
            {selectedVoice.voice_id}
          </span>
        </div>
      )}

      {/* Main content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 0' }}>

        {/* Page title */}
        <div style={{ marginBottom: 28 }} className="fade-in">
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            Call Analytics
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
            Airport AI assistant performance overview
          </p>
        </div>

        {/* Error banner */}
        {data.error && (
          <div style={{
            background: 'rgba(220,38,38,0.07)',
            border: '1px solid rgba(220,38,38,0.18)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <AlertCircle size={14} style={{ color: 'var(--error)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#7f1d1d', fontWeight: 500 }}>{data.error}</span>
          </div>
        )}

        {/* Stats block */}
        <div style={{ marginBottom: 20 }}>
          {data.loading ? (
            <div className="card skeleton" style={{ height: 200 }} />
          ) : (
            <StatsBlock
              totalCalls={data.totalCalls}
              avgDuration={data.avgDuration}
              resolutionRate={data.resolutionRate}
              totalUsers={data.totalUsers}
              delay={0}
            />
          )}
        </div>

        {/* Charts row 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 14,
          marginBottom: 20,
          alignItems: 'stretch',
        }}>
          {data.loading ? (
            <>
              <div className="card skeleton" style={{ height: 260 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card skeleton" style={{ flex: 1 }} />
                <div className="card skeleton" style={{ flex: 1 }} />
              </div>
            </>
          ) : (
            <>
              <ActivityHeatmap data={data.callHeatmap} delay={100} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ResolutionGauge rate={data.resolutionRate} delay={150} />
                <div className="card fade-in" style={{
                  animationDelay: '180ms',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="label">Avg Turns / Call</span>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(146,153,184,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={11} style={{ color: '#9299b8' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>
                      {data.avgTurnCount.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>turns per conversation</div>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: '#f0f2f8', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(data.avgTurnCount / 10 * 100, 100)}%`, borderRadius: 4, background: 'linear-gradient(90deg, #4a7a9b, #9299b8)' }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts row 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 20,
        }}>
          {data.loading ? (
            <>
              <div className="card skeleton" style={{ height: 320 }} />
              <div className="card skeleton" style={{ height: 320 }} />
            </>
          ) : (
            <>
              <TopicsChart data={data.topTopics} delay={200} />
              <ToolsChart data={data.topTools} delay={240} />
            </>
          )}
        </div>

        {/* Charts row 3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 20,
        }}>
          {data.loading ? (
            <>
              <div className="card skeleton" style={{ height: 280 }} />
              <div className="card skeleton" style={{ height: 280 }} />
            </>
          ) : (
            <>
              <LatencyBreakdown
                llmMs={data.avgLlmMs}
                toolMs={data.avgToolMs}
                ttsMs={data.avgTtsMs}
                delay={280}
              />
              <UserMemoryCard
                returningUsers={data.returningUsers}
                totalUsers={data.totalUsers}
                delay={320}
              />
            </>
          )}
        </div>

        {/* Airport breakdown */}
        {!data.loading && data.airportBreakdown.length > 1 && (
          <AirportBreakdown data={data.airportBreakdown} delay={360} />
        )}

        {/* Empty state */}
        {!data.loading && !data.error && data.totalCalls === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--text-muted)',
          }}>
            <Phone size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>No calls recorded yet.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Data will appear here once calls are logged.</p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <NavigationOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {voiceModalOpen && (
        <VoiceModal
          selectedVoiceId={selectedVoice?.voice_id ?? null}
          onSelect={voice => {
            setSelectedVoice(voice)
            setVoiceModalOpen(false)
          }}
          onClose={() => setVoiceModalOpen(false)}
        />
      )}
    </div>
  )
}
