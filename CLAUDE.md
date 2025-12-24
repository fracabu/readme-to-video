# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**README2Video** - Web app that transforms GitHub READMEs into professional promotional videos.

**Pipeline:** `README.md → LLM (script) → Kie.ai Sora 2 (video) → Mux (streaming)`

**Context:** DEV's Worldwide Show and Tell Challenge - Mux (deadline: January 4, 2026)

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server
```

## Architecture

### Data Flow

1. **Input**: User submits GitHub URL or raw README text via `/api/generate`
2. **LLM Processing**: Multi-provider factory (`lib/llm/index.ts`) analyzes README and generates video script
3. **Video Generation**: `lib/kie.ts` sends prompts to Kie.ai Sora 2, polls for completion
4. **Hosting**: `lib/mux.ts` uploads completed video to Mux for streaming
5. **Real-time Updates**: SSE stream at `/api/status/[sessionId]` pushes progress to frontend

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

- **Single Scene MVP**: Currently generates 1 scene (~15s) instead of multi-scene concatenation
- **Polling over Webhooks**: Video generation uses polling (`waitForTaskCompletion`) rather than callbacks for reliability
- **Content Policy**: LLM prompts include strict guidelines to avoid brand names and copyrighted content (prevents Sora 2 rejections)
- **Mux Video Quality**: Set to `basic` tier for cost efficiency
- **Video cost**: $0.15 per 10-15s clip via Kie.ai
- **Generation time**: 2-5 minutes per scene

## External API Documentation

- `docs/MUX-DOCUMENTATION.md` - Mux integration reference
- `docs/KIE-AI-DOCUMENTATION.md` - Kie.ai Sora 2 API reference
