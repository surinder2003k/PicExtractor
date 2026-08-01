# PicSnap — Video Screenshot Extractor

Extract every frame from your videos right in the browser. No uploads, no server — 100% private.

## Features

- **Lightning fast** — parallel frame extraction with a smart seek pool
- **Every frame** — millisecond-precision frame capture from your video
- **Multiple formats** — export as PNG, JPEG, or WebP with quality control
- **Time range control** — extract only the section you need
- **ZIP batch download** — grab all selected frames as a single archive
- **Pick & choose** — select individual frames, instant single-frame capture, copy to clipboard
- **Works everywhere** — MP4, WebM, MOV, AVI, and more

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

## Tests

End-to-end tests use [Playwright](https://playwright.dev) against the production server:

```bash
npm run build
npm start
node e2e/test.js          # full feature suite
node e2e/improvements.test.js  # regression checks
```

The tests expect a `test-video.mp4` file in the project root (gitignored, dev-only). Generate one with ffmpeg:

```bash
ffmpeg -f lavfi -i testsrc=size=320x240:rate=30:duration=10 -f lavfi -i sine=frequency=440:duration=10 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest test-video.mp4
```

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/surinder2003k/picextracter)

Everything runs client-side — no server, no database, no auth required.
