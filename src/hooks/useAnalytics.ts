import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Call, Turn, UserMemory, AnalyticsData } from '../types'

function avg(arr: number[]): number {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function countFreq(items: string[]): { key: string; count: number }[] {
  const map = new Map<string, number>()
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
}

export function useAnalytics(): AnalyticsData {
  const [data, setData] = useState<AnalyticsData>({
    totalCalls: 0,
    resolutionRate: 0,
    avgDuration: 0,
    avgTurnCount: 0,
    avgLlmMs: 0,
    avgToolMs: 0,
    avgTtsMs: 0,
    callsPerDay: [],
    topTopics: [],
    topTools: [],
    returningUsers: 0,
    totalUsers: 0,
    airportBreakdown: [],
    callHeatmap: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function load() {
      try {
        const [callsRes, turnsRes, usersRes] = await Promise.all([
          supabase.from('calls').select('*').order('started_at', { ascending: true }),
          supabase.from('turns').select('*'),
          supabase.from('user_memory').select('*'),
        ])

        if (callsRes.error) throw callsRes.error

        const calls = (callsRes.data ?? []) as Call[]
        const turns = turnsRes.error ? [] : (turnsRes.data ?? []) as Turn[]
        const users = usersRes.error ? [] : (usersRes.data ?? []) as UserMemory[]

        const totalCalls = calls.length
        const resolvedCount = calls.filter(c => c.resolved).length
        const resolutionRate = totalCalls ? (resolvedCount / totalCalls) * 100 : 0

        const avgDuration = avg(calls.map(c => c.duration_s ?? 0))
        const avgTurnCount = avg(calls.map(c => c.turn_count ?? 0))
        const avgLlmMs = avg(calls.map(c => c.total_llm_ms ?? 0))
        const avgToolMs = avg(calls.map(c => c.total_tool_ms ?? 0))
        const avgTtsMs = avg(calls.map(c => c.total_tts_ms ?? 0))

        // Calls per day
        const dayMap = new Map<string, number>()
        for (const call of calls) {
          const day = call.started_at?.slice(0, 10) ?? 'unknown'
          dayMap.set(day, (dayMap.get(day) ?? 0) + 1)
        }
        const callsPerDay = Array.from(dayMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))

        // Topics frequency
        const allTopics = calls.flatMap(c => c.topics ?? [])
        const topTopics = countFreq(allTopics)
          .slice(0, 12)
          .map(({ key, count }) => ({ topic: key, count }))

        // Tools frequency from turns
        const allTools = turns.flatMap(t => t.tools_used ?? [])
        const topTools = countFreq(allTools)
          .slice(0, 12)
          .map(({ key, count }) => ({ tool: key, count }))

        // Returning users
        const returningUsers = users.filter(u => u.visit_count > 1).length
        const totalUsers = users.length

        // Heatmap: day-of-week × hour
        const heatmapMap = new Map<string, number>()
        for (const call of calls) {
          if (!call.started_at) continue
          const d = new Date(call.started_at.replace(' ', 'T').replace(/\+00$/, '+00:00'))
          if (isNaN(d.getTime())) continue
          const key = `${d.getDay()}-${d.getHours()}`
          heatmapMap.set(key, (heatmapMap.get(key) ?? 0) + 1)
        }
        const callHeatmap = Array.from(heatmapMap.entries()).map(([key, count]) => {
          const [dayOfWeek, hour] = key.split('-').map(Number)
          return { dayOfWeek, hour, count }
        })

        // Per-airport breakdown
        const airportMap = new Map<string, Call[]>()
        for (const call of calls) {
          const id = call.airport_id ?? 'unknown'
          if (!airportMap.has(id)) airportMap.set(id, [])
          airportMap.get(id)!.push(call)
        }
        const airportBreakdown = Array.from(airportMap.entries())
          .map(([airport, airCalls]) => ({
            airport,
            calls: airCalls.length,
            resolved: airCalls.filter(c => c.resolved).length,
            avgDuration: avg(airCalls.map(c => c.duration_s ?? 0)),
          }))
          .sort((a, b) => b.calls - a.calls)

        setData({
          totalCalls,
          resolutionRate,
          avgDuration,
          avgTurnCount,
          avgLlmMs,
          avgToolMs,
          avgTtsMs,
          callsPerDay,
          topTopics,
          topTools,
          returningUsers,
          totalUsers,
          airportBreakdown,
          callHeatmap,
          loading: false,
          error: null,
        })
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load data',
        }))
      }
    }

    void load()
  }, [])

  return data
}
