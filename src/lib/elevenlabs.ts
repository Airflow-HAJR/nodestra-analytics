export interface ElevenLabsVoice {
  voice_id: string
  name: string
  preview_url: string | null
  category: string
  labels: {
    accent?: string
    age?: string
    gender?: string
    use_case?: string
    description?: string
    [key: string]: string | undefined
  }
  description: string | null
}

export async function fetchVoices(): Promise<ElevenLabsVoice[]> {
  const key = import.meta.env.VITE_ELEVENLABS_API_KEY as string
  if (!key) throw new Error('VITE_ELEVENLABS_API_KEY is not set in .env.local')

  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': key },
  })
  if (!res.ok) throw new Error(`ElevenLabs API error ${res.status}: ${await res.text()}`)

  const data = await res.json()
  return (data.voices ?? []) as ElevenLabsVoice[]
}
