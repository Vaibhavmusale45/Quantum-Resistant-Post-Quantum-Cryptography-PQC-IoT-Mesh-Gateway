# Quantum-Resistant IoT Security Operations Dashboard

A responsive React + TypeScript operations dashboard for an ESP32 mesh, Raspberry Pi gateway, and backend telemetry/security service. It starts in **DEMO MODE** and clearly marks locally simulated readings and actions.

## Run locally

```sh
npm install
npm run dev
```

Create `.env.local` from `.env.example` to connect a backend. The dashboard supports this contract:

| Method | Endpoint | Use |
| --- | --- | --- |
| GET | `/api/devices` | Device registry and latest state |
| GET | `/api/sensors` | Sensor time series; accepts `deviceId` |
| GET | `/api/security/status` | Gateway-reported security posture |
| GET | `/api/logs` | Security event stream |
| POST | `/api/devices/{id}/revoke` | Revoke device credentials |
| POST | `/api/devices/{id}/command` | Send an authorized device command |
| GET | `/api/gateway/status` | Raspberry Pi health and service status |
| WebSocket | `/ws` | Live telemetry and security events |

API access is isolated in `src/services/api.ts`. Adapt response types to the backend before enabling live mode. Configuring a URL makes the service layer call the backend; it does not make the browser a cryptographic authority. Keep PQC private keys, signing, authentication, and key establishment on the backend or gateway. No secret keys are included in this frontend.

## Build

```sh
npm run build
```
