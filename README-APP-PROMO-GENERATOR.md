# 🎬 README2Video - App Promo Generator

> Trasforma il README del tuo progetto in un video promo professionale in pochi secondi.

---

## 📋 Indice

1. [La Challenge](#-la-challenge)
2. [Il Problema](#-il-problema)
3. [La Soluzione](#-la-soluzione)
4. [Come Funziona](#-come-funziona)
5. [Stack Tecnologico](#-stack-tecnologico)
6. [Architettura](#-architettura)
7. [Integrazioni API](#-integrazioni-api)
8. [Stima Costi](#-stima-costi)
9. [Features MVP](#-features-mvp)
10. [Features Future](#-features-future)
11. [Timeline di Sviluppo](#-timeline-di-sviluppo)
12. [Strategia di Pitch](#-strategia-di-pitch)
13. [Risorse Utili](#-risorse-utili)

---

## 🏆 La Challenge

### DEV's Worldwide Show and Tell Challenge - Presented by Mux

| Info | Dettaglio |
|------|-----------|
| **Organizzatore** | DEV Community + Mux |
| **Tipo** | Hackathon / Side Project Showcase |
| **Inizio** | 3 Dicembre 2025 |
| **Scadenza Submission** | 4 Gennaio 2026, 23:59 PT |
| **Annuncio Vincitori** | 22 Gennaio 2026 |
| **Età Minima** | 18+ |
| **Team** | Max 4 persone |

### Premi

| Categoria | Premio |
|-----------|--------|
| **Overall Prompt Winner** | $1,500 USD + DEV++ Membership + Badge esclusivo |
| **Best Use of Mux** | $1,500 USD + DEV++ Membership + Badge esclusivo |
| **Tutti i partecipanti** | Badge di completamento |

### Requisiti del Progetto

- ✅ Deve essere un side project software (web o mobile app)
- ✅ Codice deve essere tuo (puoi partire da open source ma con modifiche significative)
- ✅ App funzionante e testabile
- 📎 GitHub Repo (opzionale ma consigliato)
- 📎 Live demo link (opzionale ma consigliato)

### Requisiti del Video Pitch

- ⏱️ Durata: **1 minuto o meno**
- 🎥 Deve essere hostato su **Mux**
- 📝 Deve coprire:
  - Cosa fa l'app / che problema risolve
  - Perché l'hai costruita
  - Cosa la rende unica
  - Come funziona

### Criteri di Giudizio

1. **Problem & Opportunity** - Il problema è reale e significativo?
2. **Solution & Technical Approach** - La soluzione è ben implementata?
3. **Value Proposition & Audience Benefit** - Porta valore reale agli utenti?
4. **Storytelling & Pitch Quality** - Il pitch è coinvolgente?
5. **Scalability & "Would You Invest?" Potential** - Ha potenziale di crescita?

---

## 😤 Il Problema

Ogni sviluppatore che crea un'app si trova davanti allo stesso ostacolo:

> **"Ho costruito qualcosa di fantastico, ma come lo presento al mondo?"**

### Pain Points

- 📹 Creare video promo richiede **tempo** (ore/giorni)
- 💰 Assumere un video editor costa **soldi** ($100-500+ per video)
- 🎬 Servono competenze di **video editing** che molti dev non hanno
- 😩 Scrivere script convincenti è **difficile**
- 🔄 Ogni aggiornamento dell'app richiede un **nuovo video**

### Chi ha questo problema?

- Sviluppatori indie
- Startup in fase iniziale
- Partecipanti a hackathon
- Creatori di side project
- Sviluppatori che vogliono promuovere il loro portfolio

---

## 💡 La Soluzione

### README2Video

Un tool che trasforma automaticamente il README di un progetto GitHub in un video promo professionale.

```
README.md → 🎬 Video Promo (30-60 secondi)
```

### Value Proposition

> "Dal tuo README a un video promo in 2 minuti. Zero editing. Zero competenze video."

### Perché è unico

1. **Input semplicissimo** - Solo l'URL del repo GitHub
2. **AI-powered** - Estrae automaticamente le info chiave dal README
3. **Costi bassissimi** - < $2 per video generato
4. **Veloce** - Video pronto in pochi minuti
5. **Professionale** - Qualità cinematografica grazie a Sora 2

---

## ⚙️ Come Funziona

### User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTENTE                                   │
├─────────────────────────────────────────────────────────────────┤
│  1. Incolla URL GitHub o testo README                           │
│  2. Seleziona stile video (Tech, Minimal, Energetic, ecc.)      │
│  3. Seleziona durata (15s, 30s, 60s)                            │
│  4. Clicca "Genera Video"                                       │
│  5. Aspetta 2-5 minuti                                          │
│  6. Scarica/Condividi il video                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   FETCH      │    │   ANALISI    │    │   SCRIPT     │       │
│  │   README     │ -> │   AI         │ -> │   GENERATOR  │       │
│  │   (GitHub)   │    │   (Claude)   │    │   (Claude)   │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                 │                │
│                                                 ▼                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   MUX        │    │   VIDEO      │    │   PROMPT     │       │
│  │   UPLOAD     │ <- │   GENERATION │ <- │   BUILDER    │       │
│  │   & STREAM   │    │   (Kie.ai)   │    │              │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OUTPUT                                   │
├─────────────────────────────────────────────────────────────────┤
│  - Video MP4 scaricabile                                        │
│  - Link Mux per embed/share                                     │
│  - Player Mux integrato                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Dettaglio Pipeline

#### Step 1: Fetch README
```javascript
// Input: URL GitHub
// Output: Testo raw del README

const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
const readmeContent = await fetch(readmeUrl).then(r => r.text());
```

#### Step 2: Analisi AI
```javascript
// Input: README content
// Output: Structured data

const analysis = await claude.analyze({
  prompt: `Analizza questo README ed estrai:
    - nome_progetto
    - tagline (max 10 parole)
    - problema_risolto
    - features_principali (max 3)
    - tech_stack
    - target_audience
    - unique_value_proposition
  
  README:
  ${readmeContent}`
});
```

#### Step 3: Generazione Script
```javascript
// Input: Structured data + stile + durata
// Output: Script video con scene

const script = await claude.generate({
  prompt: `Crea uno script per video promo di ${durata} secondi.
    Stile: ${stile}
    
    Dati progetto:
    ${JSON.stringify(analysis)}
    
    Output: Array di scene con:
    - testo_voiceover
    - descrizione_visiva (per AI video)
    - durata_secondi`
});
```

#### Step 4: Generazione Video
```javascript
// Input: Script con scene
// Output: Video clips

const videoClips = await Promise.all(
  script.scenes.map(scene => 
    kieAi.generate({
      model: "sora2",
      prompt: scene.descrizione_visiva,
      duration: scene.durata_secondi,
      aspectRatio: "16:9"
    })
  )
);
```

#### Step 5: Upload su Mux
```javascript
// Input: Video finale
// Output: Mux playback URL

const asset = await mux.video.assets.create({
  input: videoUrl,
  playback_policy: ["public"],
});

const playbackId = asset.playback_ids[0].id;
const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
```

---

## 🛠️ Stack Tecnologico

### Frontend

| Tecnologia | Uso |
|------------|-----|
| **Next.js 14** | Framework React con App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Shadcn/ui** | Componenti UI |
| **Mux Player React** | Player video integrato |

### Backend

| Tecnologia | Uso |
|------------|-----|
| **Next.js API Routes** | Backend serverless |
| **Anthropic Claude API** | Analisi README + generazione script |
| **Kie.ai API** | Generazione video AI (Sora 2) |
| **Mux API** | Upload, hosting, streaming video |

### Infrastruttura

| Tecnologia | Uso |
|------------|-----|
| **Vercel** | Hosting + Deploy |
| **GitHub API** | Fetch README pubblici |

---

## 🏗️ Architettura

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
│                        (Next.js + React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │  Landing    │  │  Generator  │  │  Video      │             │
│   │  Page       │  │  Form       │  │  Player     │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API ROUTES                                 │
│                    (Next.js Serverless)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   /api/fetch-readme     → Fetch da GitHub                       │
│   /api/analyze          → Claude API                            │
│   /api/generate-script  → Claude API                            │
│   /api/generate-video   → Kie.ai API                            │
│   /api/upload-mux       → Mux API                               │
│   /api/status           → Polling status generazione            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ External APIs
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │  GitHub     │  │  Anthropic  │  │  Kie.ai     │             │
│   │  API        │  │  Claude     │  │  (Sora 2)   │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│                    ┌─────────────┐                               │
│                    │    Mux      │                               │
│                    │  (Video)    │                               │
│                    └─────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Integrazioni API

### 1. GitHub API (Fetch README)

```javascript
// Fetch README da repo pubblico
const fetchReadme = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        'Accept': 'application/vnd.github.raw+json'
      }
    }
  );
  return response.text();
};
```

### 2. Anthropic Claude API (Analisi + Script)

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const analyzeReadme = async (readme) => {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Analizza questo README per un video promo...`
    }]
  });
  return JSON.parse(response.content[0].text);
};
```

### 3. Kie.ai API (Video Generation - Sora 2)

```javascript
// Documentazione: https://docs.kie.ai/

const generateVideo = async (prompt, duration) => {
  const response = await fetch('https://api.kie.ai/api/v1/sora/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KIE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt,
      model: "sora2_pro",        // o sora2 per più economico
      duration: duration,         // 10 o 15 secondi
      aspectRatio: "16:9",
      resolution: "720p"          // 720p più economico, 1080p per quality
    })
  });
  
  const { taskId } = await response.json();
  return taskId;
};

// Polling per risultato
const checkVideoStatus = async (taskId) => {
  const response = await fetch(`https://api.kie.ai/api/v1/task/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.KIE_API_KEY}`
    }
  });
  return response.json();
};
```

### 4. Mux API (Video Hosting)

```javascript
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

const uploadToMux = async (videoUrl) => {
  const asset = await mux.video.assets.create({
    input: [{ url: videoUrl }],
    playback_policy: ['public'],
    encoding_tier: 'baseline'
  });
  
  return {
    assetId: asset.id,
    playbackId: asset.playback_ids[0].id,
    streamUrl: `https://stream.mux.com/${asset.playback_ids[0].id}.m3u8`
  };
};
```

---

## 💰 Stima Costi

### Costo per singolo video generato

| Servizio | Operazione | Costo Stimato |
|----------|------------|---------------|
| **GitHub API** | Fetch README | Gratis |
| **Claude API** | Analisi + Script (~2K tokens) | ~$0.02 |
| **Kie.ai Sora 2** | Video 10s 720p | ~$0.50-1.00 |
| **Kie.ai Sora 2 Pro** | Video 10s 1080p | ~$1.50-2.00 |
| **Mux** | Upload + Hosting (< 1min) | ~$0.01-0.05 |
| **TOTALE** | Per video base | **~$0.50-1.50** |
| **TOTALE** | Per video Pro | **~$1.50-2.50** |

### Costo fisso mensile (sviluppo/testing)

| Servizio | Piano | Costo |
|----------|-------|-------|
| **Vercel** | Hobby | Gratis |
| **Mux** | Pay as you go | ~$0 (basso volume) |
| **Kie.ai** | Credits | $5-20 per testing |
| **Claude API** | Pay as you go | ~$5-10 per testing |

### Break-even per la challenge

Per testare e creare il pitch video:
- ~10 video di test: $10-25
- Video pitch finale: $1-2
- **Budget totale stimato: $15-30**

---

## ✨ Features MVP

### Must Have (per la challenge)

- [ ] Input URL GitHub → fetch README
- [ ] Input testo diretto (copia/incolla README)
- [ ] Analisi README con Claude
- [ ] Generazione script video
- [ ] Generazione video con Kie.ai/Sora 2
- [ ] Upload automatico su Mux
- [ ] Player Mux integrato per preview
- [ ] Download video MP4
- [ ] UI semplice e pulita

### Nice to Have

- [ ] Selezione stile video (Tech, Minimal, Energetic)
- [ ] Selezione durata (15s, 30s, 60s)
- [ ] Preview script prima di generare
- [ ] Modifica script manuale
- [ ] Progress bar durante generazione

---

## 🚀 Features Future

### Post-Challenge Roadmap

- [ ] Autenticazione utenti
- [ ] Storico video generati
- [ ] Template video multipli
- [ ] Voiceover AI (ElevenLabs)
- [ ] Supporto più lingue
- [ ] Musica di background
- [ ] Watermark personalizzato
- [ ] API pubblica
- [ ] Integrazione CI/CD (genera video ad ogni release)
- [ ] Plugin per VS Code
- [ ] Integrazione con Product Hunt

---

## 📅 Timeline di Sviluppo

### Settimana 1 (9-15 Dicembre 2025)

| Giorno | Task |
|--------|------|
| Lun-Mar | Setup progetto Next.js, configurazione API keys |
| Mer-Gio | Implementazione fetch README + analisi Claude |
| Ven-Sab | Implementazione generazione script |
| Dom | Testing e debug |

### Settimana 2 (16-22 Dicembre 2025)

| Giorno | Task |
|--------|------|
| Lun-Mar | Integrazione Kie.ai per generazione video |
| Mer-Gio | Integrazione Mux per upload/streaming |
| Ven-Sab | UI/UX frontend |
| Dom | Testing end-to-end |

### Settimana 3 (23-29 Dicembre 2025)

| Giorno | Task |
|--------|------|
| Lun-Mar | Bug fixing e polish |
| Mer-Gio | Generazione video pitch con il tool stesso |
| Ven-Sab | Scrittura post DEV |
| Dom | Buffer / emergenze |

### Settimana 4 (30 Dic - 4 Gen 2026)

| Giorno | Task |
|--------|------|
| Lun-Mer | Finalizzazione e testing |
| Gio 2 Gen | Review finale |
| Ven 3 Gen | Ultimi ritocchi |
| Sab 4 Gen | **SUBMISSION** (entro 23:59 PT) |

---

## 🎤 Strategia di Pitch

### Il Twist Vincente

> "Questo video che state guardando? È stato generato dalla mia stessa app, partendo dal README del progetto."

### Struttura Video (60 secondi)

| Tempo | Contenuto | Visual |
|-------|-----------|--------|
| 0-5s | Hook: "Every developer has this problem..." | Dev frustrato davanti al computer |
| 5-15s | Problema: tempo/costi per video promo | Statistiche, dolore |
| 15-25s | Soluzione: README2Video | Logo + interfaccia |
| 25-40s | Demo: URL → Video in 2 minuti | Screen recording velocizzato |
| 40-50s | Perché è speciale: AI + Mux + Semplicità | Tech stack visivo |
| 50-55s | Il twist: "This video was made with README2Video" | Mind blown |
| 55-60s | CTA: "Try it now" | URL + logo |

### Script Pitch (Bozza)

```
[0-5s]
"You built something amazing. But how do you show it to the world?"

[5-15s]
"Creating promo videos takes hours. Hiring editors costs hundreds.
Most developers just... skip it."

[15-25s]
"Meet README2Video.
Paste your GitHub URL. Get a professional promo video. In minutes."

[25-40s]
"Watch: I paste my README...
AI analyzes it...
Generates a script...
Creates stunning visuals...
And boom. Video ready."

[40-50s]
"Powered by Claude for intelligence.
Sora 2 for cinematic quality.
Mux for flawless streaming."

[50-55s]
"Oh, and this video you're watching?
It was made with README2Video.
From its own README."

[55-60s]
"Turn your README into a video. Try it now."
```

### Perché può vincere

1. **Problema reale** → Ogni dev su DEV.to lo capisce
2. **Soluzione elegante** → Semplicissima da usare
3. **Best Use of Mux** → Core del prodotto
4. **Meta pitch** → Memorabile e creativo
5. **Scalabile** → Potenziale SaaS chiaro
6. **Target giusto** → La community DEV stessa

---

## 📚 Risorse Utili

### Documentazione API

| Servizio | Link |
|----------|------|
| Mux | https://docs.mux.com/ |
| Mux Getting Started | https://docs.mux.com/guides/get-started |
| Mux Node SDK | https://github.com/muxinc/mux-node-sdk |
| Mux Player React | https://github.com/muxinc/elements/tree/main/packages/mux-player-react |
| Kie.ai | https://docs.kie.ai/ |
| Kie.ai Sora 2 | https://kie.ai/sora-2-pro |
| Anthropic Claude | https://docs.anthropic.com/ |
| GitHub API | https://docs.github.com/en/rest |

### Challenge

| Risorsa | Link |
|---------|------|
| Pagina Challenge | https://dev.to/challenges/mux |
| Post Lancio | (vedere pagina challenge) |
| Template Submission | (vedere pagina challenge) |
| Regole Ufficiali | https://dev.to/challenges/mux (link nelle FAQ) |

### Ispirazione

| Risorsa | Link |
|---------|------|
| Mux AI Workflows | https://docs.mux.com/guides/ai |
| Mux + fal.ai Demo | (repo citato nella challenge) |
| Video Semantic Search | (repo citato nella challenge) |

---

## 📝 Checklist Submission

### Prima della Submission

- [ ] App funzionante e deployata
- [ ] GitHub repo pubblico
- [ ] Video pitch generato con l'app stessa
- [ ] Video caricato su Mux
- [ ] Video ≤ 60 secondi
- [ ] Video copre: cosa fa, perché, cosa lo rende speciale, come funziona
- [ ] Credenziali di test pronte (se serve login)
- [ ] README del progetto completo

### Post Submission

- [ ] Pubblicare post su DEV con template ufficiale
- [ ] Embed video Mux nel post
- [ ] Tag corretti sul post
- [ ] Condividere sui social

---

## 🤝 Team

| Ruolo | Nome | DEV Handle |
|-------|------|------------|
| Developer | TBD | @tbd |

---

## 📄 Licenza

MIT License (consigliata dalla challenge)

---

**Ultima modifica:** Dicembre 2025

**Status:** 🚧 In Development
