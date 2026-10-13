import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'dark' | 'purple' | 'midnight' | 'light'
export type AccentColor = 'violet' | 'cyan' | 'indigo'
export type FontSize = 'compact' | 'default' | 'large'
export type SidebarStyle = 'expanded' | 'compact'

interface Settings {
  theme: Theme
  accent: AccentColor
  fontSize: FontSize
  sidebarStyle: SidebarStyle
  animationsEnabled: boolean
  notificationsEnabled: boolean
  autoRefresh: boolean
  refreshInterval: number
  timezone: string
  dateFormat: string
  language: string
}

interface SettingsContextType {
  settings: Settings
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  reset: () => void
  css: { bg: string; sidebar: string; card: string; accent: string; accentMuted: string; accentText: string; border: string; text: string; muted: string; sub: string }
}

const defaults: Settings = {
  theme: 'dark',
  accent: 'violet',
  fontSize: 'default',
  sidebarStyle: 'expanded',
  animationsEnabled: true,
  notificationsEnabled: true,
  autoRefresh: true,
  refreshInterval: 30,
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  language: 'English',
}

const ACCENT_MAP: Record<AccentColor, { primary: string; muted: string; text: string }> = {
  violet: { primary: '#6600FF', muted: 'rgba(102,0,255,0.15)', text: '#A880FF' },
  cyan:   { primary: '#0891B2', muted: 'rgba(8,145,178,0.15)',  text: '#67E8F9' },
  indigo: { primary: '#4F46E5', muted: 'rgba(79,70,229,0.15)', text: '#A5B4FC' },
}

const THEME_MAP: Record<Theme, { bg: string; sidebar: string; card: string; border: string; text: string; muted: string; sub: string }> = {
  dark:     { bg: '#0A080F', sidebar: '#12101A', card: '#12101A', border: '#1E1A2E', text: '#EDE8F8', muted: '#7760AA', sub: '#C4A8F0' },
  purple:   { bg: '#0D0818', sidebar: '#160C28', card: '#160C28', border: '#2A1550', text: '#F0EAFF', muted: '#8855BB', sub: '#CCA8F8' },
  midnight: { bg: '#060810', sidebar: '#0C0F1E', card: '#0C0F1E', border: '#151B30', text: '#E8EEF8', muted: '#5A6A99', sub: '#A8B8E8' },
  light:    { bg: '#F4F2FA', sidebar: '#FFFFFF', card: '#FFFFFF', border: '#E2DCF5', text: '#1A1232', muted: '#8877AA', sub: '#4B3A80' },
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('sdwan-settings')
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
    } catch { return defaults }
  })

  useEffect(() => {
    localStorage.setItem('sdwan-settings', JSON.stringify(settings))
  }, [settings])

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const reset = () => setSettings(defaults)

  const t = THEME_MAP[settings.theme]
  const a = ACCENT_MAP[settings.accent]

  const css = {
    bg: t.bg, sidebar: t.sidebar, card: t.card, border: t.border,
    text: t.text, muted: t.muted, sub: t.sub,
    accent: a.primary, accentMuted: a.muted, accentText: a.text,
  }

  return (
    <SettingsContext.Provider value={{ settings, update, reset, css }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
