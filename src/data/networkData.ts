/**
 * Backend-ready data placeholders.
 * These values intentionally contain no sample telemetry.
 * Later, populate them from backend endpoints such as:
 *   GET /api/sites
 *   GET /api/telemetry/latest
 *   GET /api/alerts
 */

export type SiteStatus = 'Online' | 'Warning' | 'Offline' | null

export interface NetworkSite {
  id: string
  name: string
  role: string
  status: SiteStatus
  latencyMs: number | null
  bandwidthMbps: number | null
  packetLossPercent: number | null
  ipAddress: string | null
}

export interface NetworkAlert {
  id: string
  severity: 'Critical' | 'Warning' | 'Info' | 'AI Prediction'
  message: string
  site: string | null
  timestamp: string | null
}

// These three entries describe the required network topology, not live status.
// Replace null values with API response data when the backend is available.
export const networkSites: NetworkSite[] = [
  { id: 'hq', name: 'Headquarters', role: 'HQ', status: null, latencyMs: null, bandwidthMbps: null, packetLossPercent: null, ipAddress: null },
  { id: 'branch-1', name: 'Manufacturing Branch 1', role: 'Branch 1', status: null, latencyMs: null, bandwidthMbps: null, packetLossPercent: null, ipAddress: null },
  { id: 'branch-2', name: 'Manufacturing Branch 2', role: 'Branch 2', status: null, latencyMs: null, bandwidthMbps: null, packetLossPercent: null, ipAddress: null },
]

// Empty until the backend supplies real events or AI predictions.
export const networkAlerts: NetworkAlert[] = []

// Placeholder for an eventual GET /api/network/summary response.
export const networkSummary = {
  onlineSites: null as number | null,
  totalSites: networkSites.length,
  averageLatencyMs: null as number | null,
  totalBandwidthMbps: null as number | null,
  openAlerts: null as number | null,
}
