# Kie.ai Sora 2 API - Documentazione Tecnica Completa

## Indice

1. [Panoramica](#panoramica)
2. [Autenticazione](#autenticazione)
3. [Modelli Disponibili](#modelli-disponibili)
4. [Creazione Task Video](#creazione-task-video)
5. [Polling Status](#polling-status)
6. [Callback Webhooks](#callback-webhooks)
7. [File Upload](#file-upload)
8. [Pricing](#pricing)
9. [Codici di Errore](#codici-di-errore)
10. [Esempi Completi](#esempi-completi)

---

## Panoramica

Kie.ai fornisce accesso API a modelli di generazione video AI, incluso Sora 2. La piattaforma offre:

- **Text-to-Video**: Genera video da prompt testuali
- **Image-to-Video**: Anima immagini statiche in video
- **99.9% Uptime** e supporto 24/7
- **Sistema crediti**: 1 credito = $0.005 USD

**Base URL**: `https://api.kie.ai`

---

## Autenticazione

Tutte le API richiedono Bearer Token.

```
Authorization: Bearer YOUR_API_KEY
```

**Ottenere API Key**: https://kie.ai/api-key

### Headers Richiesti

```javascript
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.KIE_API_KEY}`
};
```

---

## Modelli Disponibili

### Video Models

| Model ID | Descrizione | Durata |
|----------|-------------|--------|
| `sora-2-text-to-video` | Text to video base | 10s/15s |
| `sora-2-image-to-video` | Image to video base | 10s/15s |
| `sora-2-pro-text-to-video` | Pro quality (720p/1080p) | 10s/15s |
| `sora-2-pro-image-to-video` | Pro image animation | 10s/15s |
| `sora-2-pro-storyboard` | Multi-scene storyboard | variabile |
| `sora-watermark-remover` | Rimuove watermark | - |
| `kling-2.6/text-to-video` | Kling 2.6 text to video | 5s/10s |

### Altri Modelli

- **Veo 3.1**: Google video generation (1080p nativo)
- **Runway Aleph**: Multi-task editing video
- **Hailuo, Wan, Bytedance**: Alternative video models

---

## Sora 2 Image-to-Video (MODELLO PRINCIPALE)

Questo è il modello che useremo per README2Video: genera video cinematografici a partire da immagini statiche.

### Specifiche Tecniche

| Parametro | Valore |
|-----------|--------|
| **Model ID** | `sora-2-image-to-video` |
| **Durata** | 10s o 15s |
| **Risoluzione** | Standard (720p) o High (1080p) |
| **Aspect Ratio** | `landscape` (16:9) o `portrait` (9:16) |
| **Formati Immagine** | JPEG, PNG, WebP |
| **Max Dimensione Immagine** | 10MB |
| **Costo** | $0.15 per video (30 crediti) |
| **Tempo Generazione** | 2-5 minuti |

### Confronto Pricing

| Provider | Costo per 10s | Risparmio |
|----------|---------------|-----------|
| **Kie.ai** | $0.15 | - |
| OpenAI Sora | $1.00 | 85% |
| Fal.ai | $1.00 | 85% |

### Request Body

```json
{
  "model": "sora-2-image-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "The scene comes alive with gentle camera movement, cinematic lighting",
    "image_urls": ["https://example.com/screenshot.png"],
    "aspect_ratio": "landscape",
    "n_frames": "15",
    "size": "standard",
    "remove_watermark": true
  }
}
```

### Parametri Image-to-Video

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|--------------|-------------|
| `input.prompt` | string | Sì | Descrizione del movimento desiderato (max 10000 chars) |
| `input.image_urls` | string[] | Sì | Array con URL immagine (pubblicamente accessibile) |
| `input.aspect_ratio` | string | No | `landscape` o `portrait` |
| `input.n_frames` | string | No | `10` o `15` (secondi) |
| `input.size` | string | No | `standard` (720p) o `high` (1080p) |
| `input.remove_watermark` | boolean | No | Rimuove watermark |

### Esempio Completo Node.js

```javascript
// 1. Upload immagine (se locale)
const imageUrl = await uploadImageToKie(screenshotBuffer);

// 2. Genera video
const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.KIE_API_KEY}`
  },
  body: JSON.stringify({
    model: 'sora-2-image-to-video',
    callBackUrl: `${process.env.APP_URL}/api/kie-callback`,
    input: {
      prompt: 'Smooth camera push-in revealing the interface, subtle parallax effect on UI elements, professional tech aesthetic with soft lighting',
      image_urls: [imageUrl],
      aspect_ratio: 'landscape',
      n_frames: '15',
      remove_watermark: true
    }
  })
});

const { data } = await response.json();
console.log('Task ID:', data.taskId);
// Video sarà pronto in 2-5 minuti via callback
```

### Tips per Prompt Image-to-Video

Per ottenere i migliori risultati:

1. **Descrivi il movimento**: "camera slowly zooms in", "gentle parallax effect", "smooth pan across"
2. **Mantieni coerenza**: Il video manterrà la visual consistency dell'immagine originale
3. **Aggiungi atmosfera**: "cinematic lighting", "professional aesthetic", "subtle motion"
4. **Evita cambi drastici**: L'AI anima l'immagine, non la trasforma completamente

---

## Creazione Task Video

### Endpoint

```
POST https://api.kie.ai/api/v1/jobs/createTask
```

### Request Body - Text-to-Video

```json
{
  "model": "sora-2-text-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "A beautiful sunset over the ocean, cinematic drone shot, 4K quality",
    "aspect_ratio": "landscape",
    "n_frames": "15",
    "remove_watermark": true
  }
}
```

### Parametri

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|--------------|-------------|
| `model` | string | Sì | ID modello (es. `sora-2-text-to-video`) |
| `callBackUrl` | string | No | URL webhook per notifiche completamento |
| `input.prompt` | string | Sì | Prompt testuale (max 10000 caratteri) |
| `input.aspect_ratio` | string | No | `landscape` (16:9) o `portrait` (9:16) |
| `input.n_frames` | string | No | `10` o `15` (secondi) |
| `input.remove_watermark` | boolean | No | Rimuove watermark dal video |

### Request Body - Image-to-Video

```json
{
  "model": "sora-2-image-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "The scene comes alive with gentle movement...",
    "image_urls": ["https://example.com/image.jpg"],
    "aspect_ratio": "landscape",
    "n_frames": "15",
    "remove_watermark": true
  }
}
```

**Nota**: `image_urls` deve contenere URL pubblicamente accessibili. Usa il File Upload API per caricare immagini locali.

### Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task_sora-2-text-to-video_1765184035859"
  }
}
```

### Esempio cURL

```bash
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "sora-2-text-to-video",
    "callBackUrl": "https://your-domain.com/callback",
    "input": {
      "prompt": "A professor teaching in a classroom, cinematic lighting",
      "aspect_ratio": "landscape",
      "n_frames": "15",
      "remove_watermark": true
    }
  }'
```

### Esempio Node.js

```javascript
const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.KIE_API_KEY}`
  },
  body: JSON.stringify({
    model: 'sora-2-text-to-video',
    callBackUrl: 'https://your-domain.com/api/callback',
    input: {
      prompt: 'A cinematic scene of a sunset over mountains',
      aspect_ratio: 'landscape',
      n_frames: '15',
      remove_watermark: true
    }
  })
});

const result = await response.json();
const taskId = result.data.taskId;
```

---

## Polling Status

### Endpoint

```
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId={taskId}
```

### Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task_12345678",
    "model": "sora-2-text-to-video",
    "state": "success",
    "param": "{...original params...}",
    "resultJson": "{\"resultUrls\":[\"https://example.com/video.mp4\"]}",
    "failCode": "",
    "failMsg": "",
    "completeTime": 1698765432000,
    "createTime": 1698765400000,
    "updateTime": 1698765432000
  }
}
```

### Stati Task

| State | Descrizione |
|-------|-------------|
| `waiting` | In coda |
| `queuing` | Nella coda di processing |
| `generating` | In elaborazione |
| `success` | Completato con successo |
| `fail` | Fallito |

### Rate Limit

**10 requests/secondo** per API key

### Esempio Polling

```javascript
async function waitForVideo(taskId, maxWait = 600) {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait * 1000) {
    const response = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        headers: { 'Authorization': `Bearer ${process.env.KIE_API_KEY}` }
      }
    );

    const result = await response.json();
    const { state, resultJson, failMsg } = result.data;

    if (state === 'success') {
      const parsed = JSON.parse(resultJson);
      return parsed.resultUrls[0];
    }

    if (state === 'fail') {
      throw new Error(`Generation failed: ${failMsg}`);
    }

    // Attendi 10 secondi prima del prossimo check
    await new Promise(r => setTimeout(r, 10000));
  }

  throw new Error('Timeout waiting for video');
}
```

---

## Callback Webhooks

Invece di fare polling, puoi ricevere notifiche automatiche via webhook.

### Configurazione

Aggiungi `callBackUrl` nella richiesta di creazione task:

```json
{
  "model": "sora-2-text-to-video",
  "callBackUrl": "https://your-domain.com/api/kie-callback",
  "input": { ... }
}
```

### Payload Success

```json
{
  "code": 200,
  "msg": "Playground task completed successfully.",
  "data": {
    "taskId": "e989621f54392584b05867f87b160672",
    "model": "sora-2-text-to-video",
    "state": "success",
    "resultJson": "{\"resultUrls\":[\"https://tempfile.aiquickdraw.com/video.mp4\"],\"resultWaterMarkUrls\":[\"https://tempfile.aiquickdraw.com/video-watermark.mp4\"]}",
    "consumeCredits": 100,
    "remainedCredits": 2510330,
    "costTime": 8,
    "completeTime": 1755599644000,
    "createTime": 1755599634000,
    "param": "{...original request params...}"
  }
}
```

### Payload Failure

```json
{
  "code": 501,
  "msg": "Playground task failed.",
  "data": {
    "taskId": "bd3a37c523149e4adf45a3ddb5faf1a8",
    "state": "fail",
    "failCode": "500",
    "failMsg": "Internal server error",
    "consumeCredits": 0,
    "remainedCredits": 2510430
  }
}
```

### Campi Callback

| Campo | Descrizione |
|-------|-------------|
| `state` | `success` o `fail` |
| `taskId` | Identificativo task |
| `resultJson` | JSON string con `resultUrls` (array URL video) |
| `consumeCredits` | Crediti utilizzati |
| `remainedCredits` | Crediti rimanenti |
| `costTime` | Tempo elaborazione (secondi) |
| `failCode` | Codice errore (se fallito) |
| `failMsg` | Messaggio errore (se fallito) |

### Esempio Handler Webhook (Next.js)

```typescript
// app/api/kie-callback/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  const { code, data } = body;

  if (code === 200 && data.state === 'success') {
    const resultJson = JSON.parse(data.resultJson);
    const videoUrl = resultJson.resultUrls[0];

    // Salva videoUrl nel database
    await saveVideoToDatabase({
      taskId: data.taskId,
      videoUrl: videoUrl,
      credits: data.consumeCredits
    });
  } else {
    // Gestisci errore
    console.error('Video generation failed:', data.failMsg);
  }

  return new Response('OK', { status: 200 });
}
```

---

## File Upload

Per usare immagini locali con image-to-video, prima caricale su Kie.ai.

### Metodi Upload

1. **Base64 Upload**: `POST /api/file-base64-upload`
2. **Stream Upload**: `POST /api/file-stream-upload`
3. **URL Upload**: `POST /api/file-url-upload`

### Caratteristiche

- File temporanei, eliminati automaticamente dopo **3 giorni**
- Supporta immagini fino a **10MB**
- Formati: JPEG, PNG, WebP

### Esempio Base64 Upload

```javascript
const imageBase64 = fs.readFileSync('image.jpg', 'base64');

const response = await fetch('https://api.kie.ai/api/file-base64-upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.KIE_API_KEY}`
  },
  body: JSON.stringify({
    file: imageBase64,
    filename: 'image.jpg'
  })
});

const { url } = await response.json();
// Usa url in image_urls per image-to-video
```

---

## Pricing

### Sora 2

| Modello | Durata | Crediti | Costo USD |
|---------|--------|---------|-----------|
| Sora 2 Base | 10s | 30 | $0.15 |
| Sora 2 Base | 15s | 30 | $0.15 |
| Sora 2 Pro Standard | 10s | 150 | $0.75 |
| Sora 2 Pro Standard | 15s | 270 | $1.35 |
| Sora 2 Pro HD | 10s | 330 | $1.65 |
| Sora 2 Pro HD | 15s | 630 | $3.15 |
| Watermark Remover | - | 10 | $0.05 |

### Kling 2.6

| Durata | Audio | Crediti |
|--------|-------|---------|
| 5s | No | ~50 |
| 10s | No | ~100 |
| 5s | Sì | +50 |

### Conversione Crediti

**1 credito = $0.005 USD**

---

## Codici di Errore

| Code | Descrizione |
|------|-------------|
| 200 | Success |
| 401 | Unauthorized - API key invalida |
| 402 | Insufficient Credits |
| 404 | Not Found |
| 422 | Validation Error - Parametri non validi |
| 429 | Rate Limited |
| 455 | Service Unavailable |
| 500 | Server Error |
| 501 | Generation Failed |
| 505 | Feature Disabled |

---

## Esempi Completi

### Pipeline Completa: Storyboard + Video Generation

```javascript
// 1. Genera storyboard con Claude
const storyboard = await generateStoryboardWithClaude(businessDescription);

// 2. Crea task per ogni scena
const tasks = [];
for (const scene of storyboard.scenes) {
  const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.KIE_API_KEY}`
    },
    body: JSON.stringify({
      model: 'sora-2-text-to-video',
      input: {
        prompt: scene.prompt,
        aspect_ratio: 'landscape',
        n_frames: '15',
        remove_watermark: true
      }
    })
  });

  const result = await response.json();
  tasks.push({
    sceneNumber: scene.scene_number,
    taskId: result.data.taskId
  });

  // Rate limiting
  await new Promise(r => setTimeout(r, 2000));
}

// 3. Attendi completamento e scarica
const videoUrls = [];
for (const task of tasks) {
  const videoUrl = await waitForVideo(task.taskId);
  videoUrls.push(videoUrl);
}

// 4. Upload su Mux per streaming
for (const url of videoUrls) {
  await mux.video.assets.create({
    inputs: [{ url }],
    playback_policies: ['public']
  });
}
```

### Kling Text-to-Video con Audio

```javascript
const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.KIE_API_KEY}`
  },
  body: JSON.stringify({
    model: 'kling-2.6/text-to-video',
    callBackUrl: 'https://your-domain.com/callback',
    input: {
      prompt: 'A bustling city street at night with neon signs',
      aspect_ratio: '16:9',
      duration: 10,
      sound: true
    }
  })
});
```

---

## Best Practices

### Prompt Engineering

Per ottenere video di alta qualità:

1. **Sii specifico**: Descrivi dettagli visivi, illuminazione, movimento camera
2. **Usa termini cinematografici**: "cinematic", "drone shot", "golden hour", "tracking shot"
3. **Specifica qualità**: "4K", "professional", "high quality"
4. **Includi atmosfera**: "dramatic lighting", "warm colors", "soft focus"

### Esempio Prompt Ottimale

```
"Cinematic aerial drone shot of a modern tech office at golden hour.
Camera slowly pushes forward through floor-to-ceiling windows,
revealing developers working at sleek workstations.
Warm natural lighting with lens flares, shallow depth of field,
professional corporate aesthetic, 4K quality."
```

### Rate Limiting

- Aspetta 2 secondi tra le richieste di creazione task
- Usa callbacks invece di polling quando possibile
- Non superare 10 req/s per status polling

### Gestione Costi

- Usa Sora 2 Base ($0.15) per test e prototipi
- Passa a Pro solo per video finali
- Monitora `remainedCredits` nei callback

---

## Link Utili

- **Dashboard**: https://kie.ai/logs
- **API Keys**: https://kie.ai/api-key
- **Documentazione**: https://docs.kie.ai/
- **Pricing**: https://kie.ai/pricing
- **Support**: support@kie.ai
