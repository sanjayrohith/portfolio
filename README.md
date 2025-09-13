<div align="center">

# Sanjay Rohith — Portfolio

Elegant, fast personal site built with Next.js 15, TypeScript, Tailwind, and shadcn/ui — featuring a local terminal simulation and a tasteful Three.js particle background.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000)](https://ui.shadcn.com/)
[![three.js](https://img.shields.io/badge/three.js-3D-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

> Live site URL: set `NEXT_PUBLIC_SITE_URL` in `.env.local` and deploy (Vercel recommended).

## ✨ Features
- Local terminal simulation with typewriter effect — no external APIs required
- Glassmorphic, accessible mobile navigation with smooth transitions
- Three.js particle background tuned for performance on mobile
- Polished dark theme with high contrast and focus-visible styles
- SEO defaults: metadata, robots.txt, sitemap.xml, and JSON-LD Person schema
- Contact form with server route and honeypot spam protection
- Strict type and lint gates for safer changes

## 🧰 Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript, React 18
- UI: Tailwind CSS, shadcn/ui, lucide-react icons
- 3D: three.js

## 🚀 Quick start
Prerequisites: Node.js 18+

```sh
cp .env.example .env.local  # fill values
npm install
npm run dev
```

App runs at http://localhost:9002 by default.

## ⚙️ Environment variables
Create `.env.local` from `.env.example`:

- NEXT_PUBLIC_SITE_URL: Public site URL for metadata/sitemap (e.g., https://yourdomain.com)
- Optional email integration (if you wire it in `src/app/api/contact/route.ts`):
	- RESEND_API_KEY, or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS

## 📁 Project structure
```
src/
	app/               # App Router pages, SEO routes, API endpoints
	components/        # UI, layout, terminal, 3D background
	hooks/             # Custom hooks
	lib/               # Utilities and data
```

Key files:
- `src/components/terminal.tsx` – local terminal output generator
- `src/components/layout/header.tsx` – header with glassmorphic mobile menu
- `src/components/3d-background.tsx` – optimized particle background
- `src/app/api/contact/route.ts` – contact form handler with honeypot
- `src/app/sitemap.ts` and `src/app/robots.ts` – SEO

## 📦 Scripts
- `dev` – Next dev server with Turbopack on port 9002
- `build` – Production build
- `start` – Start production server
- `lint` – ESLint
- `typecheck` – TypeScript checks

## 🧪 Quality gates
- Run `npm run typecheck` and `npm run lint` before pushing
- CI-ready — add your preferred GitHub Action to call the scripts above

## ☁️ Deployment
- Vercel, Netlify, Render, or any Next.js-compatible host
- Ensure `NEXT_PUBLIC_SITE_URL` is set in your host’s environment

## 🧩 Roadmap
- [ ] Optional: email delivery with Resend or SMTP
- [ ] Optional: add GitHub Actions for CI (typecheck + lint + build)
- [ ] Optional: add Open Graph preview image in `public/` and reference in metadata

## 🙌 Acknowledgements
- shadcn/ui for unstyled primitives
- three.js for the background

## 📝 License
This project is open-sourced under the MIT License. See [LICENSE](./LICENSE).
 

