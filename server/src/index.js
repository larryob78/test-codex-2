require('dotenv').config();
const express = require('express');
const cors = require('cors');

const generationRouter = require('./routes/generation');
const { SIZE_PRESETS } = require('./config/presets');

const app = express();

const corsOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['*'];

app.use(
  cors({
    origin: corsOrigins,
  })
);
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    presets: SIZE_PRESETS.length,
  });
});

app.use('/api', generationRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({
    error: err.message || 'Unexpected error generating creative assets.',
  });
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sedncae creative server listening on port ${PORT}`);
  });
}

module.exports = app;
