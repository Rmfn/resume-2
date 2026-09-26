# roya.

Personal résumé of Roya Bawazir, built as a handheld device you power on and explore with a click wheel.

**Stack:** Vite · React · Framer Motion (`motion`) · GSAP (`@gsap/react`, ScrambleText, ScrollTo)

## Run it

```bash
npm install
npm run dev
```

## Edit content

All résumé content lives in [`src/data.js`](src/data.js).

## Controls

| Input | Action |
| --- | --- |
| `P` / power switch / wheel centre | power on |
| spin the wheel · `↑ ↓` | move through lists, scroll |
| tap a wheel side · `Alt` + arrow | change channel (work / about / contact / skills) |
| wheel centre · `Enter` | open |
| back button · `Esc` | back |
| `1`–`9` | jump to an item |
| `M` | toggle click sound |

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
Enable it once under **Settings → Pages → Source: GitHub Actions**.
