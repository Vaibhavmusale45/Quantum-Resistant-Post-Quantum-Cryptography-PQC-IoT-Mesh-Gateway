export type DeviceStatus = 'online' | 'offline' | 'revoked'
export type Device = { id: string; name: string; ip: string; status: DeviceStatus; temperature: number; humidity: number; motion: boolean; authentication: 'verified' | 'revoked'; integrity: 'verified' | 'failed'; lastSeen: string; transport: string }
export type GatewayStatus = { status: string; cpu: number; memory: number; temperature: number; disk: number; mqtt: string; api: string; database: string }
export type SecurityStatus = { status: string; authentication: string; keyEstablishment: string; encryption: string; integrity: string; tls: string }

export const demoMode = !import.meta.env.VITE_API_BASE_URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const demoDevices: Device[] = [
  { id: 'node-01', name: 'ESP32 Node-01', ip: '192.168.1.21', status: 'online', temperature: 22.8, humidity: 47, motion: false, authentication: 'verified', integrity: 'verified', lastSeen: '2 sec ago', transport: 'Wi-Fi' },
  { id: 'node-02', name: 'ESP32 Node-02', ip: '192.168.1.22', status: 'online', temperature: 23.4, humidity: 51, motion: true, authentication: 'verified', integrity: 'verified', lastSeen: '3 sec ago', transport: 'LoRa' },
  { id: 'node-03', name: 'ESP32 Node-03', ip: '192.168.1.23', status: 'online', temperature: 21.9, humidity: 45, motion: false, authentication: 'verified', integrity: 'verified', lastSeen: '4 sec ago', transport: 'Zigbee' },
  { id: 'node-04', name: 'ESP32 Node-04', ip: '192.168.1.24', status: 'online', temperature: 24.1, humidity: 49, motion: false, authentication: 'verified', integrity: 'verified', lastSeen: '2 sec ago', transport: 'Wi-Fi' },
]
const demoGateway: GatewayStatus = { status: 'ONLINE', cpu: 28, memory: 61, temperature: 48, disk: 37, mqtt: 'Connected', api: 'Connected', database: 'Connected' }
const demoSecurity: SecurityStatus = { status: 'VERIFIED', authentication: 'VERIFIED', keyEstablishment: 'SECURE', encryption: 'ACTIVE', integrity: 'VERIFIED', tls: 'SECURE' }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) throw new Error('API base URL is not configured')
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`API request failed (${response.status})`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
export function getDevices(): Promise<Device[]> { return apiBaseUrl ? request<Device[]>('/api/devices') : Promise.resolve(structuredClone(demoDevices)) }
export function getSensors(deviceId?: string): Promise<unknown> { return apiBaseUrl ? request(`/api/sensors${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ''}`) : Promise.resolve([]) }
export function getSecurityStatus(): Promise<SecurityStatus> { return apiBaseUrl ? request<SecurityStatus>('/api/security/status') : Promise.resolve({ ...demoSecurity }) }
export function getLogs(): Promise<unknown[]> { return apiBaseUrl ? request<unknown[]>('/api/logs') : Promise.resolve([]) }
export function revokeDevice(id: string): Promise<void> { return apiBaseUrl ? request<void>(`/api/devices/${encodeURIComponent(id)}/revoke`, { method: 'POST' }) : Promise.resolve() }
export function sendDeviceCommand(id: string, command: string): Promise<unknown> { return apiBaseUrl ? request(`/api/devices/${encodeURIComponent(id)}/command`, { method: 'POST', body: JSON.stringify({ command }) }) : Promise.resolve({ accepted: true, demo: true }) }
export function getGatewayStatus(): Promise<GatewayStatus> { return apiBaseUrl ? request<GatewayStatus>('/api/gateway/status') : Promise.resolve({ ...demoGateway }) }
export function connectLiveUpdates(onMessage: (message: MessageEvent) => void): () => void {
  if (!apiBaseUrl) return () => undefined
  const url = new URL(apiBaseUrl); url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'; url.pathname = `${url.pathname.replace(/\/$/, '')}/ws`
  const socket = new WebSocket(url); socket.addEventListener('message', onMessage); return () => socket.close()
}