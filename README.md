# worksight-web-app

The reviewer-facing web app and the public marketing landing page for WorkSight, in one bundle. Built with Vite + React + TypeScript, styled with Tailwind, data layer powered by Tanstack Query.

---

## Stack

| Layer | Tech |
|---|---|
| Bundler | Vite 8 |
| Framework | React 19 + React Router 7 |
| Styling | Tailwind 3 (light-mode only, single green palette) |
| Data | Tanstack Query (no global state) |
| Icons | Lucide, proxied via `src/shared/ui/icons` so we can swap libraries later |
| Conventions | Feature-Sliced Design — see [`docs/fe-guide.md`](../docs/fe-guide.md) |

Color palette and typography are defined in [`docs/color-guide.md`](../docs/color-guide.md). No dark mode by design.

---

## Quick start

```bash
npm install
npm run dev
```

Boots the Vite dev server on **port 5173**. The app expects the backend at `http://localhost:4000/api` by default.

The backend must be running locally — see [`worksight-backend/README.md`](../worksight-backend/README.md).

---

## Environment

```bash
# Optional. Defaults to http://localhost:4000/api.
VITE_API_BASE=http://localhost:4000/api
```

Set this for staging / production builds.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | TypeScript build + Vite production build to `dist/` |
| `npm run preview` | Serves the production build locally |

---

## Routes

```
/                       Public marketing landing page (no auth)
/login                  Reviewer sign-in
/signup                 Reviewer sign-up

/app                    App shell — everything below requires auth
/app/candidates         Candidates list + create modal
/app/candidates/:id     Candidate detail + history
/app/assignments        Assignment templates list
/app/assignments/:id    Assignment detail + assign-to-candidate flow
/app/instances          All assignment instances, filtered by status
/app/sessions/:id       Reviewer's session detail with screenshot scrubber + scoring
/app/settings           Settings (rules, post-submission, screenshots)
/app/account            Reviewer profile + password
```

---

## Project layout (FSD)

```
src/
├── app.tsx                       # Routing + provider tree
├── main.tsx                      # ReactDOM root
├── index.css                     # Tailwind + base styles + Google Fonts
├── features/                     # One folder per business capability
│   ├── auth/                     # signup / login / account
│   ├── candidates/               # list, detail, create modal, regenerate code
│   ├── assignments/              # templates, instances, assign-to-candidate
│   ├── sessions/                 # session review screen, screenshot scrubber, scoring
│   ├── settings/                 # rules, post-submission, screenshots tabs
│   ├── landing/                  # public marketing page
│   └── shell/                    # app sidebar + outlet
└── shared/
    ├── ui/                       # Button, Input, Card, Modal, Badge, Logo, icons proxy
    ├── hooks/                    # useAuth, useToast
    ├── services/                 # api-client (fetch wrapper)
    ├── utils/                    # format-date, copy-to-clipboard, status-tone
    └── types/                    # cross-feature TS types matching backend payloads
```

Each feature folder contains its own `api/` (Tanstack Query hooks), `parts/` (sub-components specific to that feature), and `screens/` (page-level components).

---

## Screenshots in session review

The reviewer's session detail view shows a scrubbable timeline of screenshots. The image bytes live in an external file service; we fetch a presigned GET URI per key and render an `<img>`. Cached via `useScreenshotUri(key)` for ~50 minutes (the underlying URI is valid for 1 hour).

```
/api/sessions/:id  →  { screenshots: [{ key, capturedAt }] }
                              │
                              ▼
        useScreenshotUri(key)  →  GET https://go-file-service-…/get-file-uri?key=…
                                      → { uri }
                                      → <img src={uri} />
```

The web app never sees image bytes through our API.

---

## What this app deliberately does NOT do

- Use any global state library (Redux, Zustand, Jotai). Tanstack Query covers server state; React state + props cover UI state.
- Have a dark mode. The color palette is single-mode by design — see `color-guide.md`.
- Run automated tests in v1.
