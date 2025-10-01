# Bulk Video Builder

A Next.js 14 app router project that turns spreadsheet rows into batch Creatomate renders. Import CSV data, preview individual renders, queue batches, and track progress from a dashboard.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in `.env.local` (see `.env.local` in repo for defaults).
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

## Features

- Create projects tied to a Creatomate template.
- Import CSV data or paste rows and validate with Zod.
- Preview a single row render or queue an entire batch.
- Receive Creatomate webhooks to update render status and download links.
- Download individual videos or a ZIP archive of all completed renders in a project.

## Notes

- Update `lib/creatomate.ts` if you want to integrate another rendering provider.
- Optional S3 credentials can be provided if you plan to persist ZIP archives server-side.
- Additional hardening (auth, rate limits, retries, etc.) can be layered on as needed.
