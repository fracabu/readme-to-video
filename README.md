# README2Video

<div align="center">

![README2Video Banner](https://img.shields.io/badge/README2Video-Transform%20READMEs%20into%20Videos-FF6B35?style=for-the-badge&logo=youtube&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Mux](https://img.shields.io/badge/Mux-Video%20Streaming-FF2D55?style=flat-square)](https://mux.com/)
[![Sora 2](https://img.shields.io/badge/Sora%202-AI%20Video-8B5CF6?style=flat-square)](https://kie.ai/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[English](#english)** | **[Italiano](#italiano)**

---

<img src="https://img.shields.io/badge/Powered%20by-Sora%202%20AI-8B5CF6?style=for-the-badge" alt="Powered by Sora 2"/>
<img src="https://img.shields.io/badge/LLM-Multi--Provider-F59E0B?style=for-the-badge" alt="Multi-Provider LLM"/>
<img src="https://img.shields.io/badge/Streaming-Mux-FF2D55?style=for-the-badge" alt="Mux Streaming"/>

</div>

---

<a name="english"></a>
## 🇬🇧 English

### What is README2Video?

**README2Video** is a web application that automatically transforms GitHub README files into professional promotional videos. Simply paste a GitHub repository URL or raw README content, and our AI-powered pipeline will:

1. **Analyze** your README to extract key information
2. **Generate** a compelling video script with scenes
3. **Create** stunning AI-generated video clips using Sora 2
4. **Host** the final video on Mux for instant streaming

```
README.md → LLM Analysis → AI Video Generation → Mux Streaming → Share!
```

### Key Features

| Feature | Description |
|---------|-------------|
| **GitHub Integration** | Paste any public GitHub URL and automatically fetch the README |
| **Multi-Provider LLM** | Choose between Anthropic Claude, OpenAI GPT, Google Gemini, or OpenRouter (free tier available) |
| **AI Video Generation** | Powered by Sora 2 via Kie.ai - cinematic quality videos with native audio |
| **Real-time Progress** | Live updates via Server-Sent Events (SSE) showing each generation step |
| **Professional Hosting** | Videos hosted on Mux with adaptive bitrate streaming |
| **Multiple Styles** | Choose between Tech, Minimal, or Energetic video aesthetics |
| **Multi-Scene Support** | Generate 15s (1 scene), 30s (2 scenes), or 60s (4 scenes) videos |
| **Video Quality Options** | Standard (720p), Pro (720p enhanced), or Pro HD (1080p) via Sora 2 |
| **Smooth Transitions** | Professional crossfade transitions between scenes using FFmpeg |
| **Dynamic Thumbnails** | Interactive slider to select the perfect thumbnail frame (0-15s) |
| **GIF Preview** | Animated GIF preview of your video for social sharing |
| **MP4 Download** | One-click download of your video in MP4 format |
| **Easy Sharing** | One-click copy for Mux player share link or embed code |

### How It Works

1. **Input**: Enter a GitHub URL or paste your README content directly
2. **Configure**: Select video style, duration (15s/30s/60s), quality (Standard/Pro/Pro HD), and LLM provider
3. **Generate**: Click "Generate Video" and watch the real-time progress with two-column layout
4. **Share**: Copy the Mux player link or embed code to share your video

### Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, Tailwind CSS, shadcn/ui, Radix UI |
| **Backend** | Next.js 14 API Routes, Server-Sent Events |
| **AI/LLM** | Anthropic Claude, OpenAI GPT, Google Gemini, OpenRouter |
| **Video** | Kie.ai Sora 2 (text-to-video), FFmpeg (concatenation) |
| **Streaming** | Mux Video (adaptive streaming, player embed) |
| **Validation** | Zod schema validation |

### Quick Start

```bash
# Clone the repository
git clone https://github.com/fracabu/readme-to-video.git
cd readme-to-video

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Live Demo

🚀 **Try it now:** [readme2video.onrender.com](https://readme2video.onrender.com)

> **Note:** The demo runs on Render free tier. For 60-second videos (4 scenes), we recommend running locally as free hosting may timeout during long generations.

### Deploy Your Own

#### Render (Recommended for BYOK)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork this repository
2. Connect to Render and select your fork
3. Render will auto-detect the `render.yaml` configuration
4. No environment variables needed - users provide their own API keys (BYOK)

**Why Render?** Unlike serverless platforms (Vercel, Netlify), Render runs as a persistent Node.js process, allowing long-running video generation without timeouts.

#### Vercel

Works for 15-30s videos. 60s videos may timeout on free tier.

```bash
vercel deploy
```

### Environment Variables

```env
# LLM Providers (configure at least one)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AI...
OPENROUTER_API_KEY=sk-or-...

# Video Generation (required)
KIE_API_KEY=your-kie-api-key

# Video Hosting (required)
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_LLM_PROVIDER=openrouter
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Start video generation process |
| `/api/status/[sessionId]` | GET | SSE stream for real-time progress updates |
| `/api/kie-callback` | POST | Webhook receiver for Kie.ai notifications |

### Available LLM Models

<details>
<summary><strong>OpenRouter (Free Tier Available)</strong></summary>

- `google/gemini-2.0-flash-exp:free` - Gemini 2.0 Flash (FREE)
- `deepseek/deepseek-r1-0528:free` - DeepSeek R1 (FREE)
- `meta-llama/llama-3.3-70b-instruct:free` - Llama 3.3 70B (FREE)
- `mistralai/devstral-2512:free` - Devstral (FREE)

</details>

<details>
<summary><strong>Anthropic</strong></summary>

- `claude-opus-4-5-20251124` - Claude Opus 4.5
- `claude-sonnet-4-5-20250929` - Claude Sonnet 4.5

</details>

<details>
<summary><strong>OpenAI</strong></summary>

- `gpt-4o` - GPT-4o
- `gpt-4o-mini` - GPT-4o Mini

</details>

<details>
<summary><strong>Google Gemini</strong></summary>

- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-pro` - Gemini 2.5 Pro

</details>

### Pricing

| Service | Cost |
|---------|------|
| Video Generation - Standard (Sora 2) | $0.15 per scene |
| Video Generation - Pro (Sora 2 Pro) | $1.35 per scene |
| Video Generation - Pro HD (Sora 2 Pro 1080p) | $3.15 per scene |
| LLM (OpenRouter Free) | $0.00 |
| Mux Streaming | Pay-as-you-go |

---

<a name="italiano"></a>
## 🇮🇹 Italiano

### Cos'è README2Video?

**README2Video** è un'applicazione web che trasforma automaticamente i file README di GitHub in video promozionali professionali. Basta incollare l'URL di un repository GitHub o il contenuto del README, e la nostra pipeline AI:

1. **Analizza** il README per estrarre le informazioni chiave
2. **Genera** uno script video coinvolgente con scene
3. **Crea** clip video AI mozzafiato usando Sora 2
4. **Ospita** il video finale su Mux per lo streaming istantaneo

```
README.md → Analisi LLM → Generazione Video AI → Streaming Mux → Condividi!
```

### Funzionalità Principali

| Funzionalità | Descrizione |
|--------------|-------------|
| **Integrazione GitHub** | Incolla qualsiasi URL GitHub pubblico e scarica automaticamente il README |
| **LLM Multi-Provider** | Scegli tra Anthropic Claude, OpenAI GPT, Google Gemini o OpenRouter (tier gratuito disponibile) |
| **Generazione Video AI** | Powered by Sora 2 via Kie.ai - video di qualità cinematografica con audio nativo |
| **Progresso Real-time** | Aggiornamenti live via Server-Sent Events (SSE) per ogni step di generazione |
| **Hosting Professionale** | Video ospitati su Mux con streaming adattivo |
| **Stili Multipli** | Scegli tra estetica Tech, Minimal o Energetic |
| **Supporto Multi-Scena** | Genera video da 15s (1 scena), 30s (2 scene) o 60s (4 scene) |
| **Opzioni Qualità Video** | Standard (720p), Pro (720p migliorato), o Pro HD (1080p) via Sora 2 |
| **Transizioni Fluide** | Crossfade professionali tra le scene con FFmpeg |
| **Thumbnail Dinamiche** | Slider interattivo per selezionare il frame perfetto (0-15s) |
| **Anteprima GIF** | Anteprima animata del video per condivisione social |
| **Download MP4** | Download del video in formato MP4 con un click |
| **Condivisione Facile** | Un click per copiare link Mux player o codice embed |

### Come Funziona

1. **Input**: Inserisci un URL GitHub o incolla il contenuto del README direttamente
2. **Configura**: Seleziona stile video, durata (15s/30s/60s), qualità (Standard/Pro/Pro HD) e provider LLM
3. **Genera**: Clicca "Generate Video" e segui il progresso in tempo reale con layout a due colonne
4. **Condividi**: Copia il link Mux player o il codice embed per condividere il tuo video

### Stack Tecnologico

| Categoria | Tecnologie |
|-----------|------------|
| **Frontend** | React 18, Tailwind CSS, shadcn/ui, Radix UI |
| **Backend** | Next.js 14 API Routes, Server-Sent Events |
| **AI/LLM** | Anthropic Claude, OpenAI GPT, Google Gemini, OpenRouter |
| **Video** | Kie.ai Sora 2 (text-to-video), FFmpeg (concatenazione) |
| **Streaming** | Mux Video (streaming adattivo, player embed) |
| **Validazione** | Zod schema validation |

### Avvio Rapido

```bash
# Clona il repository
git clone https://github.com/fracabu/readme-to-video.git
cd readme-to-video

# Installa le dipendenze
npm install

# Configura le variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con le tue API key

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Demo Live

🚀 **Provalo ora:** [readme2video.onrender.com](https://readme2video.onrender.com)

> **Nota:** La demo gira su Render free tier. Per video da 60 secondi (4 scene), consigliamo di eseguire in locale poiché l'hosting gratuito potrebbe andare in timeout.

### Deploy

#### Render (Consigliato per BYOK)

1. Fai fork del repository
2. Connetti a Render e seleziona il tuo fork
3. Render rileverà automaticamente la configurazione `render.yaml`
4. Nessuna variabile d'ambiente necessaria - gli utenti usano le proprie API key (BYOK)

**Perché Render?** A differenza delle piattaforme serverless (Vercel, Netlify), Render funziona come processo Node.js persistente, permettendo generazioni video lunghe senza timeout.

### Variabili d'Ambiente

```env
# Provider LLM (configura almeno uno)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=AI...
OPENROUTER_API_KEY=sk-or-...

# Generazione Video (obbligatorio)
KIE_API_KEY=your-kie-api-key

# Hosting Video (obbligatorio)
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret

# Configurazione App
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_LLM_PROVIDER=openrouter
```

### Endpoint API

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/generate` | POST | Avvia il processo di generazione video |
| `/api/status/[sessionId]` | GET | Stream SSE per aggiornamenti progresso real-time |
| `/api/kie-callback` | POST | Receiver webhook per notifiche Kie.ai |

### Modelli LLM Disponibili

<details>
<summary><strong>OpenRouter (Tier Gratuito Disponibile)</strong></summary>

- `google/gemini-2.0-flash-exp:free` - Gemini 2.0 Flash (GRATIS)
- `deepseek/deepseek-r1-0528:free` - DeepSeek R1 (GRATIS)
- `meta-llama/llama-3.3-70b-instruct:free` - Llama 3.3 70B (GRATIS)
- `mistralai/devstral-2512:free` - Devstral (GRATIS)

</details>

<details>
<summary><strong>Anthropic</strong></summary>

- `claude-opus-4-5-20251124` - Claude Opus 4.5
- `claude-sonnet-4-5-20250929` - Claude Sonnet 4.5

</details>

<details>
<summary><strong>OpenAI</strong></summary>

- `gpt-4o` - GPT-4o
- `gpt-4o-mini` - GPT-4o Mini

</details>

<details>
<summary><strong>Google Gemini</strong></summary>

- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-pro` - Gemini 2.5 Pro

</details>

### Costi

| Servizio | Costo |
|----------|-------|
| Generazione Video - Standard (Sora 2) | $0.15 per scena |
| Generazione Video - Pro (Sora 2 Pro) | $1.35 per scena |
| Generazione Video - Pro HD (Sora 2 Pro 1080p) | $3.15 per scena |
| LLM (OpenRouter Free) | $0.00 |
| Streaming Mux | Pay-as-you-go |

---

<div align="center">

## Challenge

<img src="https://img.shields.io/badge/DEV-Worldwide%20Show%20and%20Tell-0A0A0A?style=for-the-badge&logo=dev.to" alt="DEV Challenge"/>
<img src="https://img.shields.io/badge/Presented%20by-Mux-FF2D55?style=for-the-badge" alt="Mux"/>

**Deadline**: January 4, 2026 | **Scadenza**: 4 Gennaio 2026

---

### License / Licenza

MIT License - See [LICENSE](LICENSE) for details.

---

<sub>Built with ❤️ using Next.js, Sora 2 AI, and Mux</sub>

<sub>Costruito con ❤️ usando Next.js, Sora 2 AI e Mux</sub>

</div>
