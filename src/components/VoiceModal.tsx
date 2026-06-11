import { useEffect, useRef, useState, useMemo } from 'react'
import { X, Mic, Play, Square, Check, Search } from 'lucide-react'
import { fetchVoices, type ElevenLabsVoice } from '../lib/elevenlabs'

interface Props {
  selectedVoiceId: string | null
  onSelect: (voice: ElevenLabsVoice) => void
  onClose: () => void
}

const GENDER_FILTERS = ['All', 'Female', 'Male'] as const

const LABEL_COLORS: Record<string, string> = {
  american: '#dbeafe',
  british: '#e0e7ff',
  australian: '#dcfce7',
  african: '#fef9c3',
  female: '#fce7f3',
  male: '#ede9fe',
  young: '#d1fae5',
  middle_aged: '#ffedd5',
  old: '#f3f4f6',
  narration: '#e0f2fe',
  'news presenter': '#fef3c7',
  conversational: '#d1fae5',
  characters: '#ede9fe',
  meditation: '#ccfbf1',
}

function LabelPill({ text }: { text: string }) {
  const bg = LABEL_COLORS[text.toLowerCase()] ?? '#f3f4f6'
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.04em',
      background: bg,
      color: '#374151',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {text}
    </span>
  )
}

function WaveBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 18 }}>
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: '#2A4A5E',
            animation: `wavePulse 0.8s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function VoiceCard({
  voice,
  isPlaying,
  isSelected,
  onPlay,
  onSelect,
}: {
  voice: ElevenLabsVoice
  isPlaying: boolean
  isSelected: boolean
  onPlay: () => void
  onSelect: () => void
}) {
  const labels = Object.entries(voice.labels ?? {})
    .filter(([, v]) => v)
    .map(([, v]) => v as string)
    .slice(0, 3)

  return (
    <div style={{
      borderRadius: 12,
      border: isSelected ? '2px solid #2A4A5E' : '1px solid rgba(0,0,0,0.07)',
      background: isSelected ? 'rgba(42,74,94,0.04)' : '#fff',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
      boxShadow: isSelected ? '0 0 0 3px rgba(42,74,94,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
      cursor: 'default',
      position: 'relative',
    }}>
      {/* Name row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f1423', lineHeight: 1.2 }}>
            {voice.name}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9299b8', marginTop: 2 }}>
            {voice.category}
          </div>
        </div>
        {isSelected && (
          <div style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#2A4A5E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Check size={11} color="#fff" />
          </div>
        )}
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {labels.map(l => <LabelPill key={l} text={l} />)}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        {/* Play button + waveform */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onPlay}
            disabled={!voice.preview_url}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: isPlaying ? '#2A4A5E' : 'rgba(42,74,94,0.1)',
              color: isPlaying ? '#fff' : '#2A4A5E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: voice.preview_url ? 'pointer' : 'not-allowed',
              opacity: voice.preview_url ? 1 : 0.4,
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
          >
            {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </button>
          {isPlaying && <WaveBars />}
        </div>

        {/* Select button */}
        <button
          onClick={onSelect}
          style={{
            padding: '5px 12px',
            borderRadius: 7,
            border: isSelected ? 'none' : '1px solid rgba(0,0,0,0.12)',
            background: isSelected ? '#2A4A5E' : 'transparent',
            color: isSelected ? '#fff' : '#4a5278',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'all 0.15s',
          }}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  )
}

export default function VoiceModal({ selectedVoiceId, onSelect, onClose }: Props) {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState<typeof GENDER_FILTERS[number]>('All')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchVoices()
      .then(v => setVoices(v))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))

    return () => {
      audioRef.current?.pause()
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = useMemo(() => {
    return voices.filter(v => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        v.name.toLowerCase().includes(q) ||
        Object.values(v.labels ?? {}).some(l => l?.toLowerCase().includes(q))
      const matchGender = genderFilter === 'All' ||
        v.labels?.gender?.toLowerCase() === genderFilter.toLowerCase()
      return matchSearch && matchGender
    })
  }, [voices, search, genderFilter])

  function togglePlay(voice: ElevenLabsVoice) {
    if (playingId === voice.voice_id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    audioRef.current?.pause()
    if (!voice.preview_url) return
    const audio = new Audio(voice.preview_url)
    audio.play().catch(() => {})
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    setPlayingId(voice.voice_id)
  }

  return (
    <>
      <style>{`
        @keyframes wavePulse {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,12,20,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#f5f6fa',
            borderRadius: 20,
            boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
            width: '100%',
            maxWidth: 860,
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            animation: 'modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px 16px',
            background: '#fff',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: '#2A4A5E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Mic size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f1423', letterSpacing: '-0.02em' }}>Voice Library</div>
                  <div style={{ fontSize: 11, color: '#9299b8', fontWeight: 500 }}>
                    {loading ? 'Loading…' : `${filtered.length} voices`}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#9299b8',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Search + filters */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#f5f6fa',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
                padding: '8px 12px',
              }}>
                <Search size={13} style={{ color: '#9299b8', flexShrink: 0 }} />
                <input
                  autoFocus
                  placeholder="Search voices…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: 13,
                    color: '#0f1423',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {GENDER_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setGenderFilter(f)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 8,
                      border: genderFilter === f ? 'none' : '1px solid rgba(0,0,0,0.08)',
                      background: genderFilter === f ? '#2A4A5E' : '#fff',
                      color: genderFilter === f ? '#fff' : '#4a5278',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {loading && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 140, borderRadius: 12 }} />
                ))}
              </div>
            )}

            {error && (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: '#dc2626',
              }}>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Failed to load voices</p>
                <p style={{ fontSize: 12, color: '#9299b8' }}>{error}</p>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9299b8' }}>
                <Mic size={28} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>No voices match your search</p>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}>
                {filtered.map(voice => (
                  <VoiceCard
                    key={voice.voice_id}
                    voice={voice}
                    isPlaying={playingId === voice.voice_id}
                    isSelected={selectedVoiceId === voice.voice_id}
                    onPlay={() => togglePlay(voice)}
                    onSelect={() => {
                      onSelect(voice)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
