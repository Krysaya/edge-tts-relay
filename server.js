// 本地运行版：node server.js  (默认 http://localhost:3000)
// 用于本地测试（手机连电脑需同一局域网，或直接部署 Vercel 更省事）
const http = require('http');
const handler = require('./api/tts.js');
const PORT = process.env.PORT || 3000;

http.createServer(handler).listen(PORT, () => console.log('edge-tts relay running on http://localhost:' + PORT));
