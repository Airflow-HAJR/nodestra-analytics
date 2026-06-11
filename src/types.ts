export interface Call {
  call_id: string
  airport_id: string
  user_id_hash: string
  started_at: string
  duration_s: number
  turn_count: number
  total_llm_ms: number
  total_tool_ms: number
  total_tts_ms: number
  llm_calls: number
  tool_calls: number
  flight_number: string | null
  topics: string[]
  resolved: boolean
  summary: string | null
}

export interface Turn {
  call_id: string
  turn_number: number
  llm_ms: number
  tool_ms: number
  tts_ms: number
  total_ms: number
  other_ms: number
  llm_calls: number
  tool_calls: number
  tools_used: string[]
}

export interface UserMemory {
  user_id_hash: string
  airport_id: string
  visit_count: number
  last_seen: string
  last_flight: string | null
  last_location: string | null
  last_location_name: string | null
  profile_facts: Record<string, unknown>
}

export interface AnalyticsData {
  totalCalls: number
  resolutionRate: number
  avgDuration: number
  avgTurnCount: number
  avgLlmMs: number
  avgToolMs: number
  avgTtsMs: number
  callsPerDay: { date: string; count: number }[]
  topTopics: { topic: string; count: number }[]
  topTools: { tool: string; count: number }[]
  returningUsers: number
  totalUsers: number
  airportBreakdown: { airport: string; calls: number; resolved: number; avgDuration: number }[]
  callHeatmap: { dayOfWeek: number; hour: number; count: number }[]
  loading: boolean
  error: string | null
}
