# Mux Video API - Documentazione Tecnica Completa

## Indice

1. [Panoramica](#panoramica)
2. [Autenticazione](#autenticazione)
3. [Creazione Asset Video](#creazione-asset-video)
4. [Direct Upload](#direct-upload)
5. [Playback e Streaming](#playback-e-streaming)
6. [Mux Player](#mux-player)
7. [Mux Uploader](#mux-uploader)
8. [Webhooks](#webhooks)
9. [Immagini e Thumbnail](#immagini-e-thumbnail)
10. [Integrazione Next.js](#integrazione-nextjs)
11. [Node SDK](#node-sdk)
12. [Rate Limits](#rate-limits)
13. [Best Practices](#best-practices)

---

## Panoramica

### Concetti Fondamentali

**Assets**: Rappresentano un file video/audio ingerito in Mux e processato per streaming adattivo. Stati possibili:
- `preparing`: download/processing in corso
- `ready`: pronto per playback
- `errored`: processing fallito

**Playback IDs**: Diversi dagli Asset IDs - servono per lo streaming via `stream.mux.com`. Ogni playback ID ha una policy:
- `public`: URL funziona senza restrizioni
- `signed`: richiede JWT token

**Environments**: Isolano risorse dev/prod all'interno di un'organizzazione.

---

## Autenticazione

### HTTP Basic Auth

```javascript
// Header format
Authorization: Basic base64(MUX_TOKEN_ID:MUX_TOKEN_SECRET)
```

### Permessi Token

| Tipo | Uso |
|------|-----|
| Read & Write | Creare/modificare risorse |
| Read Only | Solo GET requests |
| System Write | Creare signed tokens per playback sicuro |

### CORS Policy

**IMPORTANTE**: Gli endpoint Mux API NON hanno headers CORS. Le chiamate dirette dal browser falliranno. Tutte le chiamate API devono passare dal server.

```
Client → Your Server → Mux API → Server → Client
```

---

## Creazione Asset Video

### Endpoint

```
POST https://api.mux.com/video/v1/assets
```

### Parametri Request

```javascript
{
  inputs: [{ url: 'https://example.com/video.mp4' }],
  playback_policies: ['public'],  // o ['signed']
  video_quality: 'basic'          // tier encoding
}
```

### Response

```javascript
{
  id: 'asset-id',
  playback_ids: [{ id: 'playback-id', policy: 'public' }],
  status: 'preparing'  // poi diventa 'ready'
}
```

### Esempio Node.js

```javascript
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

const asset = await mux.video.assets.create({
  inputs: [{ url: 'https://example.com/video.mp4' }],
  playback_policies: ['public'],
  video_quality: 'basic',
});

// Attendere che status diventi 'ready'
const playbackId = asset.playback_ids[0].id;
const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
```

### Video Quality Tiers

| Tier | Descrizione |
|------|-------------|
| `basic` | Encoding base, più economico |
| `plus` | Qualità migliore |
| `premium` | Massima qualità |

---

## Direct Upload

### Flusso Direct Upload

1. Server crea upload URL via API
2. Client carica direttamente a Mux
3. Webhook notifica quando asset è ready

### Creare Upload URL (Server-side)

```javascript
const upload = await mux.video.uploads.create({
  new_asset_settings: {
    playback_policies: ['public'],
    video_quality: 'basic'
  },
  cors_origin: 'https://your-domain.com'
});

// Restituire upload.url al client
```

### Response Upload

```javascript
{
  id: 'upload-id',
  url: 'https://storage.googleapis.com/...',  // URL per upload
  status: 'waiting',
  new_asset_settings: { ... }
}
```

---

## Playback e Streaming

### URL Streaming HLS

```
https://stream.mux.com/{PLAYBACK_ID}.m3u8
```

### Opzioni Avanzate

```
// Redundant streams per failover CDN
https://stream.mux.com/{PLAYBACK_ID}.m3u8?redundant_streams=true
```

### Player Compatibili

**Web:**
- Mux Player (consigliato)
- Video.js (v7+)
- HLS.js

**Mobile:**
- iOS/tvOS: AVPlayer (nativo)
- Android: ExoPlayer

### Playback Sicuro (Signed)

```javascript
// 1. Creare asset con policy signed
const asset = await mux.video.assets.create({
  inputs: [{ url: '...' }],
  playback_policies: ['signed']
});

// 2. Generare JWT
const token = mux.jwt.signPlaybackId(playbackId, {
  expiration: '1h'
});

// 3. URL con token
const url = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
```

---

## Mux Player

### Installazione

```bash
# Web Component
npm install @mux/mux-player

# React
npm install @mux/mux-player-react
```

### Uso React

```jsx
import MuxPlayer from "@mux/mux-player-react";

export default function VideoPlayer({ playbackId }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{
        video_title: "Video Title",
        viewer_user_id: "user-123"
      }}
      accentColor="#ea580c"
    />
  );
}
```

### Uso HTML

```html
<script src="https://cdn.jsdelivr.net/npm/@mux/mux-player"></script>

<mux-player
  playback-id="YOUR_PLAYBACK_ID"
  metadata-video-title="Video Title"
  accent-color="#ea580c"
></mux-player>
```

### iframe Embed

```html
<iframe
  src="https://player.mux.com/{PLAYBACK_ID}"
  allow="accelerometer; encrypted-media; picture-in-picture"
  allowfullscreen
></iframe>
```

### Customizzazione CSS

```css
mux-player {
  --controls-backdrop-color: rgb(0 0 0 / 60%);
  --seek-backward-button: none;
  --seek-forward-button: none;
}
```

### Props Principali

| Prop | Descrizione |
|------|-------------|
| `playbackId` | ID playback Mux |
| `accentColor` | Colore accento controlli |
| `primaryColor` | Colore icone |
| `muted` | Avvia silenziato |
| `autoPlay` | Autoplay |
| `audio` | Modalità solo audio |

---

## Mux Uploader

### Installazione

```bash
# Web Component
npm install @mux/mux-uploader

# React
npm install @mux/mux-uploader-react
```

### Uso React

```jsx
import MuxUploader from "@mux/mux-uploader-react";

export default function Upload() {
  return (
    <MuxUploader
      endpoint={() =>
        fetch("/api/create-upload")
          .then(res => res.json())
          .then(data => data.url)
      }
    />
  );
}
```

### API Route per Upload URL

```javascript
// /api/create-upload.js
import Mux from '@mux/mux-node';

const mux = new Mux();

export async function POST(request) {
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policies: ['public']
    },
    cors_origin: request.headers.get('origin')
  });

  return Response.json({ url: upload.url });
}
```

### Eventi Uploader

| Evento | Descrizione |
|--------|-------------|
| `progress` | Percentuale completamento |
| `success` | Upload completato |
| `uploaderror` | Errore upload |

### Subcomponents

```jsx
// Composizione custom
<MuxUploader id="uploader">
  <MuxUploaderFileSelect muxUploader="uploader">
    <button>Seleziona File</button>
  </MuxUploaderFileSelect>
  <MuxUploaderDrop muxUploader="uploader" overlay>
    Trascina qui
  </MuxUploaderDrop>
  <MuxUploaderProgress muxUploader="uploader" type="bar" />
</MuxUploader>
```

---

## Webhooks

### Configurazione

I webhook sono configurati nel dashboard Mux. Vengono inviati come POST requests al tuo endpoint.

### Eventi Principali

| Evento | Descrizione |
|--------|-------------|
| `video.asset.created` | Asset creato |
| `video.asset.ready` | Asset pronto per playback |
| `video.asset.errored` | Errore processing |
| `video.upload.asset_created` | Upload completato, asset creato |
| `video.upload.cancelled` | Upload cancellato |
| `video.upload.errored` | Errore upload |

### Payload Webhook

```javascript
{
  type: "video.asset.ready",
  object: {
    type: "asset",
    id: "asset-id"
  },
  id: "webhook-event-id",
  environment: {
    name: "Production",
    id: "env-id"
  },
  data: {
    // Dati asset completi
    id: "asset-id",
    playback_ids: [{ id: "playback-id", policy: "public" }],
    status: "ready",
    duration: 120.5
  },
  created_at: "2024-01-15T10:30:00Z"
}
```

### Verifica Firma Webhook

```javascript
import Mux from '@mux/mux-node';

const mux = new Mux();

export async function POST(request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers);

  try {
    const event = mux.webhooks.unwrap(body, headers);

    switch (event.type) {
      case 'video.asset.ready':
        const { playback_ids, id } = event.data;
        // Salvare playback_id nel database
        break;
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('Invalid signature', { status: 401 });
  }
}
```

### Delivery

- Timeout: 5 secondi
- Retry: fino a 24 ore per risposte non-2xx
- Gestire duplicati (idempotenza)

---

## Immagini e Thumbnail

### URL Thumbnail

```
https://image.mux.com/{PLAYBACK_ID}/thumbnail.{png|jpg|webp}
```

### Parametri Query

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `time` | float | Posizione video in secondi |
| `width` | int | Larghezza pixel |
| `height` | int | Altezza pixel |
| `fit_mode` | string | preserve, stretch, crop, smartcrop, pad |
| `rotate` | int | Rotazione (90, 180, 270) |

### Esempio

```
https://image.mux.com/{PLAYBACK_ID}/thumbnail.webp?width=400&height=225&time=10&fit_mode=smartcrop
```

### GIF Animate

```
https://image.mux.com/{PLAYBACK_ID}/animated.gif?start=5&end=10&fps=15&width=320
```

**Limiti:** Max 10 secondi durata, max 1 GIF ogni 10 secondi di durata video.

### Storyboard/Sprite

Usato da Mux Player per preview timeline hover.

---

## Integrazione Next.js

### Opzione 1: next-video (Rapida)

```bash
npx -y next-video init
```

Aggiungi video in `/videos` e usa il componente fornito.

### Opzione 2: Integrazione Manuale

#### Struttura Consigliata

```
/app
  /api
    /create-upload/route.ts
    /mux-webhook/route.ts
  /upload/page.tsx
  /watch/[id]/page.tsx
```

#### API Route: Create Upload

```typescript
// app/api/create-upload/route.ts
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

const mux = new Mux();

export async function POST() {
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policies: ['public']
    },
    cors_origin: process.env.NEXT_PUBLIC_APP_URL
  });

  return NextResponse.json({ url: upload.url, id: upload.id });
}
```

#### API Route: Webhook

```typescript
// app/api/mux-webhook/route.ts
import Mux from '@mux/mux-node';

const mux = new Mux();

export async function POST(request: Request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers);

  const event = mux.webhooks.unwrap(body, headers);

  if (event.type === 'video.asset.ready') {
    const { id, playback_ids } = event.data;
    // Salvare in database
  }

  return new Response('OK');
}
```

#### Upload Page

```tsx
// app/upload/page.tsx
'use client';

import MuxUploader from '@mux/mux-uploader-react';

export default function UploadPage() {
  return (
    <MuxUploader
      endpoint={async () => {
        const res = await fetch('/api/create-upload', { method: 'POST' });
        const { url } = await res.json();
        return url;
      }}
    />
  );
}
```

#### Watch Page

```tsx
// app/watch/[id]/page.tsx
import MuxPlayer from '@mux/mux-player-react';

export default async function WatchPage({ params }) {
  const playbackId = await getPlaybackIdFromDB(params.id);

  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: 'My Video' }}
    />
  );
}
```

---

## Node SDK

### Installazione

```bash
npm install @mux/mux-node
```

### Configurazione

```javascript
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

// O con variabili ambiente auto-detected
const mux = new Mux();
// Legge MUX_TOKEN_ID e MUX_TOKEN_SECRET
```

### Metodi Principali

```javascript
// Assets
await mux.video.assets.create({ ... });
await mux.video.assets.retrieve(assetId);
await mux.video.assets.list();
await mux.video.assets.delete(assetId);

// Uploads
await mux.video.uploads.create({ ... });
await mux.video.uploads.retrieve(uploadId);

// JWT
const token = mux.jwt.signPlaybackId(playbackId, { expiration: '1h' });

// Webhooks
const event = mux.webhooks.unwrap(body, headers);
```

### Gestione Errori

```javascript
try {
  await mux.video.assets.create({ ... });
} catch (err) {
  if (err instanceof Mux.APIError) {
    console.log(err.status);   // HTTP status code
    console.log(err.message);  // Error message
  }
}
```

### Paginazione

```javascript
// Iterazione automatica
for await (const asset of mux.video.assets.list()) {
  console.log(asset.id);
}

// Paginazione manuale
const page = await mux.video.assets.list({ limit: 10 });
const nextPage = await page.getNextPage();
```

---

## Rate Limits

| Endpoint | Limite |
|----------|--------|
| Video API (POST) | 1 request/secondo |
| Video API (GET, PUT, PATCH, DELETE) | 5 requests/secondo |
| Data/Monitoring | 1-5 requests/secondo |

**HTTP 429** viene restituito quando si superano i limiti.

---

## Best Practices

### Processing Time

Per minimizzare i tempi di elaborazione, caricare video con:
- **Codec**: H.264 o HEVC
- **Audio**: AAC
- **Color**: 8-bit 4:2:0
- **GOP**: Closed GOP
- **Keyframe interval**: Max 20s (1080p) o 10s (4K)
- **Bitrate**: Max 8Mbps (1080p) o 20Mbps (4K)

### Sicurezza

- Mai esporre MUX_TOKEN_SECRET al client
- Usare `signed` policy per contenuti premium
- Verificare sempre firme webhook
- Configurare `cors_origin` per uploads

### Costi

- Usare `video_quality: 'basic'` per contenuti non premium
- Evitare upload ridondanti
- Eliminare asset non più necessari

---

## Link Utili

- [Documentazione Ufficiale](https://www.mux.com/docs/)
- [Node SDK GitHub](https://github.com/muxinc/mux-node-sdk)
- [Mux Player React](https://github.com/muxinc/elements/tree/main/packages/mux-player-react)
- [Mux Uploader React](https://github.com/muxinc/elements/tree/main/packages/mux-uploader-react)
- [API Reference](https://www.mux.com/docs/api-reference/video)
