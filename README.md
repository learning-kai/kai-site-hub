# Kai Site Hub

Kai Site Hub is a MiMo Code-inspired personal portal for Kai. It keeps the landing-page feel of the original design while linking out to the blog, GitHub, image bed, and Nextcloud.

![Preview](docs/assets/website.png)

## Features

- Canvas-based hero reveal effect
- Desktop-only typewriter subtitle in Chinese
- Copy-to-clipboard homepage command
- Chinese and English language switching
- Four feature cards backed by local assets

## Requirements

- Windows, macOS, or Linux
- A modern desktop browser
- Node.js and npm

## Setup

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173/` after the dev server starts.

## Commands

```bash
npm run dev
npm run dev -- --port 4173
npm run build
npm run test:e2e
npm run preview
```

## Configuration

- `src/i18n.js` owns the Chinese and English copy.
- `src/App.jsx` defines the outbound links and language state.
- `public/coder/assets/` stores the mirrored fonts, images, and icons.
- `tests/mimocode.spec.ts` covers rendering, assets, copy behavior, and language switching.

## Troubleshooting

- If clipboard copy fails, check browser permission settings.
- If images do not load, verify the `/coder/assets/...` paths.
- If text looks broken, make sure the files are saved as UTF-8.

## License

License not selected yet.
