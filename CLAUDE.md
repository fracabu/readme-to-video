# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**README2Video** - Web app that transforms GitHub READMEs into professional promotional videos.

**Pipeline:** `README.md → LLM (script) → Kie.ai Sora 2 (video) → Mux (streaming)`

**Context:** DEV's Worldwide Show and Tell Challenge - Mux

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server
```

## Prerequisites

- **FFmpeg**: Required for multi-scene video concatenation with crossfade transitions. Must be installed and available in PATH.

## Architecture

### Data Flow

1. **Input**: User submits GitHub URL or raw README text via `/api/generate`
   - GitHub URLs are fetched via `lib/github.ts` (tries `main`/`master` branches, multiple README filenames)
2. **LLM Processing**: Multi-provider factory (`lib/llm/index.ts`) analyzes README and generates video script
3. **Video Generation**: `lib/kie.ts` sends prompts to Kie.ai Sora 2, polls for completion
4. **Hosting**: `lib/mux.ts` uploads completed video to Mux for streaming
5. **Real-time Updates**: SSE stream at `/api/status/[sessionId]` pushes progress to frontend

### BYOK (Bring Your Own Keys)

The app uses a BYOK model - users must provide their own API keys for all services:
- `UserApiKeys` type in `types/index.ts` defines the required keys
- Keys are passed per-request, not stored server-side
- Required: Kie.ai key, Mux credentials, and one LLM provider key

### Session Management

Sessions are stored in-memory via `lib/session-store.ts` using `globalThis` to persist across Next.js hot reloads. Sessions auto-cleanup after 1 hour. For production, replace with Redis/Upstash.

The session store uses a pub/sub pattern for SSE - components subscribe via `subscribeToSession()` and receive updates when session state changes.

### LLM Provider System

Factory pattern in `lib/llm/index.ts` supports 4 providers:
- `anthropic.ts` - Claude models
- `openai.ts` - GPT models
- `gemini.ts` - Google Gemini
- `openrouter.ts` - Multi-provider (includes free models)

Each provider implements `LLMProvider` interface with `analyzeReadme()` and `generateScript()` methods.

**Default**: OpenRouter with `google/gemini-2.0-flash-exp:free` (free tier)

### Frontend Components

- `components/input-section.tsx` - GitHub URL/README input, API key configuration, style/quality selection
- `components/progress-section.tsx` - Real-time generation progress display with scene status
- `components/guide-section.tsx` - Onboarding guide for API key setup

### Key Types

All TypeScript types are centralized in `types/index.ts`:
- `Session`, `SessionStatus`, `SceneProgress` - Session state management
- `ReadmeAnalysis`, `VideoScript`, `Scene` - LLM pipeline types
- `GenerateRequest`, `GenerateResponse` - API contracts
- `AIProvider`, `DEFAULT_MODELS`, `AVAILABLE_MODELS` - Provider configuration

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate` | POST | Start video generation, returns `sessionId` |
| `/api/status/[sessionId]` | GET | SSE stream for real-time progress |
| `/api/kie-callback` | POST | Webhook receiver for Kie.ai (optional) |

## Environment Variables

```env
# LLM Providers (configure at least one)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
OPENROUTER_API_KEY=

# Video Generation (required)
KIE_API_KEY=

# Video Hosting (required)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_LLM_PROVIDER=openrouter
```

## Important Implementation Details

- **Multi-Scene Support**: Generates 1 scene (15s), 2 scenes (30s), or 4 scenes (60s). Multiple scenes are concatenated via FFmpeg with crossfade transitions (`lib/ffmpeg.ts`).
- **Video Styles**: Three aesthetic options (`tech`, `minimal`, `energetic`) that influence prompt generation.
- **Video Quality Tiers**: Three quality options via Kie.ai Sora 2:
  - `base` ($0.15/scene) - Standard 720p
  - `pro` ($1.35/scene) - Enhanced 720p
  - `pro-hd` ($3.15/scene) - 1080p
- **Polling over Webhooks**: Video generation uses polling (`waitForTaskCompletion`) rather than callbacks for reliability
- **Content Policy**: LLM prompts include strict guidelines to avoid brand names and copyrighted content (prevents Sora 2 rejections)
- **Mux Video Quality**: Set to `basic` tier for cost efficiency
- **Generation time**: 2-5 minutes per scene

## External API Documentation

- `docs/MUX-DOCUMENTATION.md` - Mux integration reference
- `docs/KIE-AI-DOCUMENTATION.md` - Kie.ai Sora 2 API reference
