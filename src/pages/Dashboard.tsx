import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { networkAlerts, networkSites, networkSummary, type NetworkSite } from '../data/networkData'

function displayValue(value: number | string | null | undefined, suffix = '') {
  return value === null || value === undefined || value === '' ? '—' : `${value}${suffix}`
}

function StatusBadge({ status }: { status: NetworkSite['status'] }) {
  if (!status) return <span className="status-badge">Awaiting data</span>
  const colors = status === 'Online'
    ? { text: '#22c55e', bg: 'rgba(34,197,94,.12)' }
    : status === 'Warning'
      ? { text: '#f59e0b', bg: 'rgba(245,158,11,.12)' }
      : { text: '#ef4444', bg: 'rgba(239,68,68,.12)' }
  return <span className="status-badge" style={{ color: colors.text, background: colors.bg }}>{status}</span>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const { css } = useSettings()
  return <div className="modal-backdrop" onClick={onClose}>
    <section className="modal-panel" style={{ background: css.card, borderColor: css.border }} onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
      {children}
    </section>
  </div>
}

export function Dashboard() {
  const { css } = useSettings()
  const [selectedSite, setSelectedSite] = useState<NetworkSite | null>(null)
  const [showRerouteModal, setShowRerouteModal] = useState(false)

  return <main className="dashboard-scroll" style={{ background: css.bg, color: css.text }}>
    <header className="page-header" style={{ borderColor: css.border, background: `${css.bg}E8` }}>
      <div><p className="eyebrow">NETWORK OPERATIONS</p><h1>SD-WAN Dashboard</h1><p className="muted">Network status from the backend.</p></div>
      <span className="demo-label">Status: Disconnected</span>
    </header>

    <div className="dashboard-content">
      <div className="notice" style={{ borderColor: css.border, background: css.card }}>
        <strong>Backend not connected.</strong> after applying the telemetry data all the dashes will be replaced by our data.
      </div>

      <section className="metric-grid" aria-label="Network summary">
        <article className="metric-card" style={{ background: css.card, borderColor: css.border }}><span className="metric-label">Sites online</span><strong>{displayValue(networkSummary.onlineSites)} <small>/ {networkSummary.totalSites}</small></strong><span className="metric-foot">Waiting for site status API</span></article>
        <article className="metric-card" style={{ background: css.card, borderColor: css.border }}><span className="metric-label">Average latency</span><strong>{displayValue(networkSummary.averageLatencyMs, ' ms')}</strong><span className="metric-foot">Waiting for telemetry API</span></article>
        <article className="metric-card" style={{ background: css.card, borderColor: css.border }}><span className="metric-label">Total bandwidth</span><strong>{displayValue(networkSummary.totalBandwidthMbps, ' Mbps')}</strong><span className="metric-foot">Waiting for telemetry API</span></article>
        <article className="metric-card" style={{ background: css.card, borderColor: css.border }}><span className="metric-label">Open alerts</span><strong>{displayValue(networkSummary.openAlerts)}</strong><span className="metric-foot">Waiting for alerts API</span></article>
      </section>

      <section className="panel" style={{ background: css.card, borderColor: css.border }}>
        <div className="section-heading"><div><h2>Network overview</h2><p className="muted">Select a location to view the fields waiting backend data.</p></div><span className="muted small">{networkSites.length} configured locations</span></div>
        <div className="network-links" aria-label="Network topology">
          {networkSites.map((site, index) => <div key={site.id} className="network-node" style={{ borderColor: css.border }}>
            <span className="node-symbol">{site.role}</span><strong>{site.name}</strong><span className="muted small">{site.status ?? 'Status unavailable'}</span>
            {index < networkSites.length - 1 && <div className="connection"><span>SD-WAN connection</span><div className="connection-line" style={{ background: css.accent }} /></div>}
          </div>)}
        </div>
        <div className="site-list">{networkSites.map(site => <button className="site-row" key={site.id} onClick={() => setSelectedSite(site)} style={{ borderColor: css.border, color: css.text }}>
          <span><strong>{site.name}</strong><small className="muted">IP: {site.ipAddress ?? 'Awaiting data'}</small></span><span className="site-row-right"><StatusBadge status={site.status} /><span className="muted small">View details →</span></span>
        </button>)}</div>
      </section>

      <div className="lower-grid">
        <section className="panel" style={{ background: css.card, borderColor: css.border }}>
          <div className="section-heading"><div><h2>Telemetry</h2><p className="muted">Values will be appeared by the telemetry API.</p></div></div>
          <div className="telemetry-table"><div className="telemetry-row telemetry-header muted"><span>Site</span><span>Latency</span><span>Bandwidth</span><span>Packet loss</span></div>
            {networkSites.map(site => <div className="telemetry-row" key={site.id}><span>{site.role}</span><strong>{displayValue(site.latencyMs, ' ms')}</strong><strong>{displayValue(site.bandwidthMbps, ' Mbps')}</strong><strong>{displayValue(site.packetLossPercent, '%')}</strong></div>)}
          </div>
        </section>
        <section className="panel" style={{ background: css.card, borderColor: css.border }}>
          <div className="section-heading"><div><h2>Logs & alerts</h2><p className="muted">Events and AI predictions from the backend.</p></div></div>
          {networkAlerts.length === 0 ? <p className="muted">No events received yet.</p> : <div className="alert-list">{networkAlerts.map(alert => <article className="alert-row" key={alert.id} style={{ borderColor: css.border }}><span className="alert-dot" /><div><strong>{alert.message}</strong><p className="muted small">{alert.site ?? 'Unknown site'} · {alert.timestamp ?? 'Time unavailable'}</p><span className="alert-type">{alert.severity}</span></div></article>)}</div>}
        </section>
      </div>

      <section className="panel control-panel" style={{ background: css.card, borderColor: css.border }}>
        <div><h2>Network controls</h2><p className="muted">Control actions will be enabled after backend API is connected.</p></div>
        <button className="primary-button" style={{ background: css.accent }} onClick={() => setShowRerouteModal(true)}> Reroute settings</button>
      </section>
    </div>

    {selectedSite && <Modal title={`${selectedSite.name} details`} onClose={() => setSelectedSite(null)}>
      <p className="muted">These fields are placeholders until the API supplies real data.</p>
      <div className="detail-list"><div><span>Status</span><StatusBadge status={selectedSite.status} /></div><div><span>IP address</span><strong>{selectedSite.ipAddress ?? 'Awaiting data'}</strong></div><div><span>Latency</span><strong>{displayValue(selectedSite.latencyMs, ' ms')}</strong></div><div><span>Bandwidth</span><strong>{displayValue(selectedSite.bandwidthMbps, ' Mbps')}</strong></div><div><span>Packet loss</span><strong>{displayValue(selectedSite.packetLossPercent, '%')}</strong></div></div>
      <button className="secondary-button" onClick={() => setSelectedSite(null)}>Close</button>
    </Modal>}
    {showRerouteModal && <Modal title="Reroute settings" onClose={() => setShowRerouteModal(false)}>
      <p>Rerouting is not available until backend control API is connected.</p>
      <p className="muted small">Future integration: connect this action to an authenticated backend endpoint, validate the administration request and check if the route is valid, then record the result in the logs.</p>
      <div className="modal-actions"><button className="secondary-button" onClick={() => setShowRerouteModal(false)}>Close</button></div>
    </Modal>}
  </main>
}
