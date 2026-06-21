# Kai Site Hub

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Stack](https://img.shields.io/badge/stack-React%2019%20%2B%20Vite%208%20%2B%20Tailwind%204-24292f)

[简体中文](README.zh-CN.md) | English

Kai Site Hub is a MiMo Code-inspired personal launchpad for Kai's public web spaces, built with local assets, bilingual copy, and Playwright-covered interactions.

![Kai Site Hub preview](docs/assets/website.png)

## Why

Personal portals often become either a plain link list or a noisy landing page. This project takes a stricter route: keep the visual rhythm of the MiMo Code page, replace the product content with Kai's real public destinations, and make the result small enough to run locally without backend services.

## Core Features

- MiMo Code-style hero with a canvas reveal effect over a local background asset.
- Config-driven navigation for blog, GitHub, image bed, Nextcloud, and product dropdown links.
- Chinese and English language switching with copy stored in `src/i18n.js`.
- Copy-to-clipboard homepage command that writes the configured homepage URL.
- Four feature cards using mirrored local images and screenshots from `public/coder/assets/`.
- Playwright e2e checks for rendering, links, assets, clipboard behavior, and language switching.

## Screenshots & Demo

The main screenshot is stored at `docs/assets/website.png`. The running page uses only local images and fonts under `public/coder/assets/`, so visual checks do not depend on third-party CDNs.

To preview the page locally:

```bash
npm run dev -- --port 4173
```

Then open `http://127.0.0.1:4173/`.

## Quick Start

Requirements:

- Node.js and npm
- Windows, macOS, or Linux
- A modern Chromium, Firefox, or WebKit browser for local verification

Install and run:

```bash
npm install
npm run dev -- --port 4173
```

Build and test:

```bash
npm run build
npm run test:e2e
```

Useful scripts:

```bash
npm run dev
npm run dev -- --port 4173
npm run build
npm run preview
npm run test:e2e
```

## Engineering Quality

- Vite 8 keeps the frontend build fast and intentionally small.
- React 19 owns state, language selection, and navigation rendering.
- Tailwind CSS 4 is available through `@tailwindcss/vite`, while pixel-sensitive clone styles stay in `src/styles.css`.
- Playwright verifies the rendered page instead of trusting static markup.
- Generated output, local dependencies, reports, and logs are ignored through `.gitignore`.

## Project Docs

- `src/App.jsx`: top-level app composition, language state, and link collection.
- `src/nav.config.json`: editable navigation data for top-level links and dropdown items.
- `src/i18n.js`: Chinese and English copy plus feature-card metadata.
- `src/components/`: page sections and reusable UI pieces.
- `src/hooks/`: browser effects such as canvas reveal, typing, and clipboard behavior.
- `docs/mouse-erase-reveal-effect.md`: notes for the hero reveal implementation.
- `docs/subtitle-typewriter-effect.md`: notes for the subtitle typing implementation.
- `tests/mimocode.spec.ts`: Playwright coverage for the core user-facing behavior.

## Privacy & Security

This is a static frontend project. It does not include a server, database, analytics SDK, login flow, or secret-bearing environment file. Outbound navigation points to Kai's public services, and the clipboard action writes only the configured homepage URL.

Before publishing changes, avoid committing `.env`, private keys, generated reports, `node_modules/`, or `dist/`.

## Release & Updates

Current package version: `0.1.0`.

No GitHub Release has been created yet. Source updates are published through normal Git commits on the active branch.

## Roadmap

- Add a deployed demo URL when the hosting target is finalized.
- Keep navigation changes data-driven through `src/nav.config.json`.
- Expand visual regression coverage if the clone fidelity becomes harder to maintain by hand.
- Add release notes when the project gets a tagged public version.

## Contributing

Keep changes focused and verify them before opening a pull request:

```bash
npm run test:e2e
npm run build
```

For copy or link changes, update `src/i18n.js` or `src/nav.config.json` first. For visual changes, preserve the MiMo Code-inspired layout unless the design direction is intentionally changing.

## Troubleshooting

- If clipboard copy fails, check browser clipboard permissions.
- If images do not load, verify the `/coder/assets/...` paths and confirm the files exist under `public/coder/assets/`.
- If text looks broken, make sure the files are saved as UTF-8.
- If Playwright cannot launch browsers, run `npx playwright install` and retry `npm run test:e2e`.

## License

Released under the [MIT License](./LICENSE).
