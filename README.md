# README2Video

<div align="center">

![README2Video Banner](https://img.shields.io/badge/README2Video-Transform%20READMEs%20into%20Videos-FF6B35?style=for-the-badge&logo=youtube&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Mux](https://img.shields.io/badge/Mux-Video%20Streaming-FF2D55?style=flat-square&logo=mux&logoColor=white)](https://mux.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[English](#english)** | **[Italiano](#italiano)**

---

<img src="https://img.shields.io/badge/Powered%20by-Sora%202%20AI-8B5CF6?style=for-the-badge" alt="Powered by Sora 2"/>
<img src="https://img.shields.io/badge/LLM-Multi--Provider-F59E0B?style=for-the-badge" alt="Multi-Provider LLM"/>

</div>

---

<a name="english"></a>
## English

### What is README2Video?

**README2Video** transforms GitHub README files into professional promotional videos in minutes. Simply paste a GitHub URL or raw README content, and our AI pipeline will analyze it, generate a compelling script, create stunning visuals, and deliver a streamable video.

```
README.md → LLM Analysis → AI Video Generation → Mux Streaming
```

### Features

| Feature | Description |
|---------|-------------|
| **Multi-Provider LLM** | Choose between Anthropic, OpenAI, Google Gemini, or OpenRouter (free tier available) |
| **AI Video Generation** | Powered by Sora 2 via Kie.ai - cinematic quality with native audio |
| **Real-time Updates** | SSE-powered progress tracking from analysis to final video |
| **Mux Integration** | Professional video hosting with adaptive streaming |
| **Multiple Styles** | Tech, Minimal, or Energetic video aesthetics |
| **GitHub Integration** | Direct README fetching from any public repository |

### Tech Stack

<div align="center">

| Frontend | Backend | AI/Video | Infrastructure |
|----------|---------|----------|----------------|
| React 18 | Next.js 14 API Routes | Anthropic Claude | Mux Video |
| Tailwind CSS | Server-Sent Events | OpenAI GPT | Kie.ai Sora 2 |
| shadcn/ui | Zod Validation | Google Gemini | — |
| Radix UI | In-memory Sessions | OpenRouter | — |

</div>

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/readme-to-video.git
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

### API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Start video generation |
| `/api/status/[sessionId]` | GET | SSE stream for real-time progress |
| `/api/kie-callback` | POST | Webhook receiver for Kie.ai |

#### Generate Request

```json
{
  "source": "url",
  "content": "https://github.com/user/repo",
  "style": "tech",
  "duration": 30,
  "provider": "openrouter",
  "model": "google/gemini-2.0-flash-exp:free"
}
```

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

- `gpt-5.2` - GPT-5.2
- `gpt-4.1` - GPT-4.1
- `o4-mini` - o4-mini (Fast Reasoning)

</details>

<details>
<summary><strong>Google Gemini</strong></summary>

- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-pro` - Gemini 2.5 Pro

</details>

### Pricing

| Service | Cost |
|---------|------|
| Video Generation (Sora 2) | $0.15 per 10-15s clip |
| LLM (OpenRouter Free) | $0.00 |
| Mux Streaming | Pay-as-you-go |

### Project Structure

```
readme-to-video/
├── app/
│   ├── api/
│   │   ├── generate/         # Main generation endpoint
│   │   ├── status/[sessionId]/ # SSE status stream
│   │   └── kie-callback/     # Webhook receiver
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── input-section.tsx     # README input form
│   ├── progress-section.tsx  # Generation progress
│   └── result-section.tsx    # Video player
├── lib/
│   ├── llm/                  # Multi-provider LLM factory
│   ├── kie.ts               # Kie.ai API wrapper
│   ├── mux.ts               # Mux API wrapper
│   ├── github.ts            # GitHub README fetcher
│   └── session-store.ts     # In-memory session management
└── types/
    └── index.ts             # TypeScript definitions
```

---

<a name="italiano"></a>
## Italiano

### Cos'è README2Video?

**README2Video** trasforma i file README di GitHub in video promozionali professionali in pochi minuti. Basta incollare un URL GitHub o il contenuto del README, e la nostra pipeline AI lo analizzerà, genererà uno script coinvolgente, creerà visual accattivanti e consegnerà un video in streaming.

```
README.md → Analisi LLM → Generazione Video AI → Streaming Mux
```

### Funzionalità

| Funzionalità | Descrizione |
|--------------|-------------|
| **LLM Multi-Provider** | Scegli tra Anthropic, OpenAI, Google Gemini o OpenRouter (tier gratuito disponibile) |
| **Generazione Video AI** | Powered by Sora 2 via Kie.ai - qualità cinematografica con audio nativo |
| **Aggiornamenti Real-time** | Tracking del progresso tramite SSE dall'analisi al video finale |
| **Integrazione Mux** | Hosting video professionale con streaming adattivo |
| **Stili Multipli** | Estetica video Tech, Minimal o Energetic |
| **Integrazione GitHub** | Fetch diretto del README da qualsiasi repository pubblico |

### Stack Tecnologico

<div align="center">

| Frontend | Backend | AI/Video | Infrastruttura |
|----------|---------|----------|----------------|
| React 18 | Next.js 14 API Routes | Anthropic Claude | Mux Video |
| Tailwind CSS | Server-Sent Events | OpenAI GPT | Kie.ai Sora 2 |
| shadcn/ui | Validazione Zod | Google Gemini | — |
| Radix UI | Sessioni In-memory | OpenRouter | — |

</div>

### Avvio Rapido

```bash
# Clona il repository
git clone https://github.com/yourusername/readme-to-video.git
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

### Riferimento API

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/generate` | POST | Avvia generazione video |
| `/api/status/[sessionId]` | GET | Stream SSE per progresso real-time |
| `/api/kie-callback` | POST | Receiver webhook per Kie.ai |

#### Richiesta Generate

```json
{
  "source": "url",
  "content": "https://github.com/user/repo",
  "style": "tech",
  "duration": 30,
  "provider": "openrouter",
  "model": "google/gemini-2.0-flash-exp:free"
}
```

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

- `gpt-5.2` - GPT-5.2
- `gpt-4.1` - GPT-4.1
- `o4-mini` - o4-mini (Ragionamento Veloce)

</details>

<details>
<summary><strong>Google Gemini</strong></summary>

- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-pro` - Gemini 2.5 Pro

</details>

### Costi

| Servizio | Costo |
|----------|-------|
| Generazione Video (Sora 2) | $0.15 per clip 10-15s |
| LLM (OpenRouter Free) | $0.00 |
| Streaming Mux | Pay-as-you-go |

### Struttura Progetto

```
readme-to-video/
├── app/
│   ├── api/
│   │   ├── generate/         # Endpoint principale generazione
│   │   ├── status/[sessionId]/ # Stream SSE stato
│   │   └── kie-callback/     # Receiver webhook
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # Componenti shadcn/ui
│   ├── input-section.tsx     # Form input README
│   ├── progress-section.tsx  # Progresso generazione
│   └── result-section.tsx    # Player video
├── lib/
│   ├── llm/                  # Factory LLM multi-provider
│   ├── kie.ts               # Wrapper API Kie.ai
│   ├── mux.ts               # Wrapper API Mux
│   ├── github.ts            # Fetcher README GitHub
│   └── session-store.ts     # Gestione sessioni in-memory
└── types/
    └── index.ts             # Definizioni TypeScript
```

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

<sub>Built with passion using Next.js, Sora 2, and Mux</sub>

<sub>Costruito con passione usando Next.js, Sora 2 e Mux</sub>

</div>
