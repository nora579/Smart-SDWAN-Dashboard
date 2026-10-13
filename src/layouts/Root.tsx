import { NavLink, Outlet } from 'react-router'
import { SettingsProvider, useSettings } from '../context/SettingsContext'

function Shell() {
  const { settings, css } = useSettings()
  const compact = settings.sidebarStyle === 'compact'

  const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: compact ? '0' : '10px',
    justifyContent: compact ? 'center' : 'flex-start',
    padding: compact ? '10px' : '10px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.15s',
    border: '1px solid',
    ...(isActive
      ? { background: css.accentMuted, color: css.accentText, borderColor: css.accent + '40' }
      : { color: css.muted, borderColor: 'transparent' }),
  })

  const mobileNavLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
    color: isActive ? css.accentText : css.muted,
    background: isActive ? css.accentMuted : 'transparent',
  })

  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: css.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 border-r transition-all"
        style={{ width: compact ? '64px' : '220px', background: css.sidebar, borderColor: css.border }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b px-4 py-4" style={{ borderColor: css.border }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: css.accent }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,4.5 13,9.5 7,13 1,9.5 1,4.5" fill="none" stroke="white" strokeWidth="1.5" />
              <circle cx="7" cy="7" r="2" fill="white" />
            </svg>
          </div>
          {!compact && (
            <div>
              <div className="text-xs font-bold tracking-wide" style={{ color: css.text }}>SD-WAN</div>
              <div className="text-xs" style={{ color: css.muted }}>Control Center</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2.5 space-y-1">
          <NavLink to="/" end style={navLinkStyle}>
            <span className="text-base flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" opacity=".6" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" opacity=".6" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" opacity=".4" />
              </svg>
            </span>
            {!compact && <span>Dashboard</span>}
          </NavLink>
        </nav>

        {/* User */}
        <div className="p-3 border-t" style={{ borderColor: css.border }}>
          <div className="flex items-center gap-2.5" style={{ justifyContent: compact ? 'center' : 'flex-start' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: css.accent, color: '#fff' }}>A</div>
            {!compact && (
              <div>
                <div className="text-xs font-medium" style={{ color: css.sub }}>Admin</div>
                <div className="text-xs" style={{ color: css.muted }}>Super User</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Page content */}
      <div className="flex-1 flex flex-col overflow-hidden pb-18 md:pb-0">
        <Outlet />
      </div>

      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex gap-1 rounded-2xl border p-1.5 shadow-2xl md:hidden"
        style={{ background: css.sidebar + 'F2', borderColor: css.border, backdropFilter: 'blur(16px)' }}
        aria-label="Primary navigation"
      >
        <NavLink to="/" end style={mobileNavLinkStyle}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="1" y="1" width="6" height="6" rx="1.5" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" opacity=".6" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" opacity=".6" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" opacity=".4" />
          </svg>
          Dashboard
        </NavLink>
      </nav>
    </div>
  )
}

export function Root() {
  return (
    <SettingsProvider>
      <Shell />
    </SettingsProvider>
  )
}
