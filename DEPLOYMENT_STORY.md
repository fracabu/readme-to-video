# The Deployment Story: From Vercel Timeouts to Render Success

*A technical narrative of deploying README2Video - the challenges, debugging journey, and solutions.*

---

## Chapter 1: The Mysterious 80%

It started with a simple observation: the video was ready on Kie.ai, but the app was stuck at "Generating..."

```
2026-01-03 20:57:16 [info] Step 1: Analyzing README...
2026-01-03 20:57:16 [error] DeprecationWarning: `url.parse()` behavior is not standardized...
```

The deprecation warning was a red herring. The real problem was lurking deeper.

## Chapter 2: The False Lead

At first, we suspected the polling mechanism wasn't detecting video completion. We added detailed logging to `lib/kie.ts`:

```typescript
console.log(`[Kie.ai] Full recordInfo response for ${taskId}:`, JSON.stringify(result, null, 2));
console.log(`[Kie.ai] Task ${taskId} - state: "${state}", has resultJson: ${!!data.resultJson}`);
```

The logs showed everything working correctly:
- State transitions: `waiting` → `queuing` → `generating` → `success`
- Video URLs being extracted properly
- All the right data in all the right places

So why wasn't it working?

## Chapter 3: The Eureka Moment

Looking at the API route, the architecture became clear:

```typescript
// app/api/generate/route.ts
export async function POST(request: Request) {
  // ... validation ...

  const session = createSession(readme);

  // Start async processing WITHOUT await
  processVideo(session.id, ...).catch((error) => {
    updateSessionStatus(session.id, 'error', error.message);
  });

  // Return immediately
  return NextResponse.json({
    sessionId: session.id,
    message: 'Video generation started',
  });
}
```

**The Problem:** On Vercel (serverless), the function returns the HTTP response and then... **terminates**. The `processVideo()` promise is abandoned mid-execution.

This works perfectly in local development where Node.js keeps running. But serverless functions don't wait for unresolved promises.

## Chapter 4: The Serverless Trap

Vercel's serverless architecture has hard timeout limits:

| Plan | Max Duration |
|------|-------------|
| Hobby | 10 seconds |
| Pro | 60 seconds |
| Enterprise | 15 minutes |

Video generation takes **2-5 minutes per scene**. A 60-second video (4 scenes) needs **10-20 minutes**.

Even Enterprise tier wouldn't be enough.

### First Attempt: `waitUntil`

We tried using Vercel's `waitUntil` to keep the function alive:

```typescript
import { waitUntil } from '@vercel/functions';

// ...

waitUntil(processingPromise);
```

But `waitUntil` only extends execution *after* the response is sent. It still respects the plan's timeout limits.

### The BYOK Dilemma

Our app uses BYOK (Bring Your Own Keys) - users provide their own API keys for Kie.ai, Mux, and LLM providers. This creates a challenge:

- **Server-side keys:** Everyone uses our keys (expensive, abuse risk)
- **User-provided keys:** Need to persist through long operations

If we switch to webhooks, Kie.ai calls back when the video is ready - but the webhook handler doesn't have access to the user's Mux credentials to upload the final video.

## Chapter 5: The Render Solution

The answer was **Render** - a platform that runs apps as persistent processes, not serverless functions.

```yaml
# render.yaml
services:
  - type: web
    name: readme2video
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
```

On Render:
- Node.js process stays alive
- No arbitrary timeouts
- Polling can run for as long as needed

### Build Challenges

First deploy failed:
```
Error: Cannot find module 'tailwindcss'
```

TailwindCSS was in `devDependencies`, but Render's production install skips those. Solution: move build-time dependencies to `dependencies`:

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.14",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20"
  }
}
```

## Chapter 6: Success... Almost

With Render, 15-second videos worked flawlessly. We pushed our luck with a 60-second video:

```
Scene 1: ✅ success (attempt 21)
Scene 2: ✅ success (attempt 1)
Scene 3: ✅ success (attempt 4)
Scene 4: ✅ success (attempt 2)
[V3rwJrQmMCyl] Concatenating 4 videos with FFmpeg...
Running FFmpeg with crossfade...
==> Running 'npm start'  ← RESTART!
```

The free tier restarted during FFmpeg concatenation. All 4 videos generated, but the final merge never completed.

## Chapter 7: Lessons Learned

### The Architecture Truth

**Serverless is not for everything.** Long-running processes need:
- Persistent compute (Render, Railway, traditional VPS)
- Background job systems (Inngest, Trigger.dev, QStash)
- Or breaking work into smaller, resumable chunks

### Practical Recommendations

For README2Video on free hosting:
- **15-30 seconds:** Reliable on free tier
- **60 seconds:** Works locally; may timeout on free hosting

### The Code That Bridges Both Worlds

We made the code work on both Vercel and Render:

```typescript
// Conditional Vercel support
let waitUntil: ((promise: Promise<unknown>) => void) | undefined;
try {
  const vercelFunctions = require('@vercel/functions');
  waitUntil = vercelFunctions.waitUntil;
} catch {
  // Not on Vercel - no-op
}

// Later...
if (waitUntil) {
  waitUntil(processingPromise);
}
```

## Epilogue: The Stack

What finally worked:

| Component | Choice | Why |
|-----------|--------|-----|
| **Hosting** | Render | Persistent process, no serverless timeouts |
| **Video AI** | Kie.ai Sora 2 | Affordable ($0.15/scene), quality output |
| **Streaming** | Mux | Professional adaptive streaming |
| **LLM** | OpenRouter | Free models available |
| **Auth** | BYOK | Users control their own costs |

---

## Technical Details

### Polling Implementation

```typescript
export async function waitForTaskCompletion(
  taskId: string,
  apiKey: string,
  maxAttempts: number = 60,  // 60 × 10s = 10 minutes max
  intervalMs: number = 10000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getTaskStatus(taskId, apiKey);

    if (status.state === 'success' && status.videoUrl) {
      return status.videoUrl;
    }

    if (status.state === 'fail' || status.state === 'failed') {
      throw new Error(`Video generation failed: ${status.error}`);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Video generation timed out');
}
```

### Session Management

In-memory sessions using `globalThis` to persist across Next.js hot reloads:

```typescript
const globalSessions = globalThis as unknown as {
  __sessions?: Map<string, Session>;
};

if (!globalSessions.__sessions) {
  globalSessions.__sessions = new Map();
}
```

For production, this should be replaced with Redis (Upstash) for proper persistence and multi-instance support.

---

*Built with determination, debugged with patience, deployed with hope.*

*— fracabu & Claude Opus 4.5*
