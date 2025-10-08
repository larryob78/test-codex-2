# Lovable Dropboard

A full-stack drag-and-drop gallery designed for Lovable. Drop files, paste from the clipboard, or
embed URLs and watch them glow inside an immersive neon interface. The Express backend stores
uploaded files locally and keeps a JSON catalogue so your board persists across restarts.

## Features

- 🔥 Glassmorphism-inspired front end with drag & drop, paste, and manual upload controls
- 🧠 Smart link detection for YouTube, Vimeo, images, videos, audio, and generic URLs
- 💾 Express API with Multer-based file uploads and persistent JSON storage
- 🧹 REST endpoints to list, create, and delete board items

## Quick start

```bash
npm install
npm run dev
```

The server boots on [http://localhost:3000](http://localhost:3000). Open the page, then drag files or
paste URLs to see them appear instantly. The `/uploads` folder contains user uploads and can be wired
into Lovable file storage as needed.

## API

| Method | Endpoint        | Description                                |
| ------ | --------------- | ------------------------------------------ |
| GET    | `/api/items`    | Returns every stored gallery item          |
| POST   | `/api/upload`   | Accepts `multipart/form-data` with files   |
| POST   | `/api/embed`    | Accepts `{ "url": "https://..." }` payload |
| DELETE | `/api/items/:id`| Deletes an item (and uploaded file if any) |

## Deployment notes

- Persist the `uploads/` and `data/` directories between deploys to keep assets
- Set `PORT` via environment variable when hosting on Lovable
- Add reverse proxy or HTTPS at the platform level as required
