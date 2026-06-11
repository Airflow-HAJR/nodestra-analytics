import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const cookieDomain = window.location.hostname.includes('nodestra.com')
  ? '.nodestra.com'
  : window.location.hostname

const cookieStorage = {
  getItem(name: string): string | null {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : null
  },
  setItem(name: string, value: string): void {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${name}=${encodeURIComponent(value)}; domain=${cookieDomain}; path=/; max-age=31536000; SameSite=Lax${secure}`
  },
  removeItem(name: string): void {
    document.cookie = `${name}=; domain=${cookieDomain}; path=/; max-age=0`
  },
}

export const supabase = createClient(url, key, {
  auth: {
    storage: cookieStorage,
    storageKey: 'nodestra-auth',
  },
})
