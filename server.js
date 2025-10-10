import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'items.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]+/gi, '-');
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

function loadItems() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to read data file', error);
    }
    return [];
  }
}

function saveItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

let items = loadItems();

function detectType(file) {
  const { mimetype } = file;
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
}

function classifyUrl(url) {
  const youtube = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/i;
  const vimeo = /vimeo\.com\/(\d+)/;
  const imageExt = /\.(png|jpe?g|gif|webp|svg)$/i;
  const videoExt = /\.(mp4|webm|ogg|mov)$/i;
  const audioExt = /\.(mp3|wav|ogg|m4a)$/i;

  if (youtube.test(url)) {
    const [, id] = url.match(youtube);
    return { type: 'embed', provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
  }

  if (vimeo.test(url)) {
    const [, id] = url.match(vimeo);
    return { type: 'embed', provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` };
  }

  if (imageExt.test(url)) return { type: 'image' };
  if (videoExt.test(url)) return { type: 'video' };
  if (audioExt.test(url)) return { type: 'audio' };

  return { type: 'link' };
}

function buildItem(payload) {
  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    ...payload,
  };
}

app.get('/api/items', (_req, res) => {
  res.json(items);
});

app.post('/api/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const newItems = req.files.map((file) => {
    const type = detectType(file);
    const baseItem = {
      type,
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      src: `/uploads/${file.filename}`,
    };

    return buildItem(baseItem);
  });

  items = [...newItems, ...items];
  saveItems(items);
  res.status(201).json(newItems);
});

app.post('/api/embed', (req, res) => {
  const { url, title } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const classification = classifyUrl(url);
  const baseItem = {
    ...classification,
    title: title || url,
    src: classification.embedUrl || url,
    originalUrl: url,
  };

  const newItem = buildItem(baseItem);
  items = [newItem, ...items];
  saveItems(items);
  res.status(201).json(newItem);
});

app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const [removed] = items.splice(index, 1);
  saveItems(items);

  if (removed.src && removed.src.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, removed.src.replace(/^\//, ''));
    fs.promises.unlink(filePath).catch((err) => {
      if (err.code !== 'ENOENT') {
        console.warn('Failed to delete file', err);
      }
    });
  }

  res.json({ success: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
