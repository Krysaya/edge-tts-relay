// Vercel Serverless Function: edge-tts relay
const edgeTts = require('edge-tts');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return; }

  let body = '';
  for await (const chunk of req) body += chunk;
  let payload;
  try { payload = JSON.parse(body || '{}'); } catch (e) { res.statusCode = 400; res.end('bad json'); return; }

  const text = (payload.text || '').toString().slice(0, 4000);
  const voice = (payload.voice || 'zh-CN-XiaoxiaoNeural').toString();
  const rate = (payload.rate || '+0%').toString();
  if (!text) { res.statusCode = 400; res.end('missing text'); return; }

  try {
    const tts = new edgeTts.TTS(voice, rate);
    const stream = tts.toStream(text);
    res.setHeader('Content-Type', 'audio/mpeg');
    stream.on('error', (e) => { if (!res.headersSent) { res.statusCode = 500; res.end('tts error'); } });
    stream.pipe(res);
  } catch (e) {
    res.statusCode = 500; res.end('error: ' + e.message);
  }
};
