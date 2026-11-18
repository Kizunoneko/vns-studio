/* 生成桌面图标 build/icon.ico（256×256，内嵌 PNG） */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 256, H = 256;
const buf = Buffer.alloc(W * H * 4);

function px(x, y, c) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = c[3] === undefined ? 255 : c[3];
}
function rect(x, y, w, h, c) {
  for (let yy = Math.round(y); yy < Math.round(y + h); yy++)
    for (let xx = Math.round(x); xx < Math.round(x + w); xx++) px(xx, yy, c);
}

const BG = [10, 10, 14, 255];
const BORDER = [58, 58, 72, 255];
const GRID = [22, 22, 30, 255];
const GREEN = [125, 251, 160, 255];
const BLUE = [91, 140, 255, 255];
const WHITE = [240, 240, 246, 255];
const DARK = [16, 16, 24, 255];

// 背景 + 网格
rect(0, 0, W, H, BG);
for (let i = 16; i < W; i += 24) rect(i, 0, 1, H, GRID);
for (let i = 16; i < H; i += 24) rect(0, i, W, 1, GRID);
// 边框
rect(6, 6, W - 12, 4, BORDER);
rect(6, H - 10, W - 12, 4, BORDER);
rect(6, 6, 4, H - 12, BORDER);
rect(W - 10, 6, 4, H - 12, BORDER);
// 四角高亮
rect(6, 6, 34, 4, BLUE);
rect(6, 6, 4, 34, BLUE);
rect(W - 40, H - 10, 34, 4, GREEN);
rect(W - 10, H - 40, 4, 34, GREEN);

// 大 V 字（两条粗斜杠）
const topY = 52, botY = 176, barW = 20;
for (let y = topY; y <= botY; y++) {
  const t = (y - topY) / (botY - topY);
  const cx = 128;
  const offset = (1 - t) * 46;           // 越往下越靠中间
  const lx = cx - offset - barW / 2;
  const rx = cx + offset - barW / 2;
  const thick = 2;
  for (let k = 0; k < thick; k++) {
    rect(lx, y, barW, 1, GREEN);
    rect(rx, y, barW, 1, GREEN);
  }
}
// V 底部收尖
rect(112, botY - 6, 32, 14, GREEN);

// 底部对话框
rect(40, 196, 176, 40, WHITE);
rect(46, 202, 164, 28, DARK);
rect(56, 210, 96, 4, WHITE);
rect(56, 220, 68, 4, [150, 150, 165, 255]);
rect(176, 210, 26, 14, BLUE);

/* ---- PNG 编码 ---- */
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(b) {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePNG(rgba, w, h) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const png = encodePNG(buf, W, H);

/* ---- ICO 封装（单张 256×256 PNG） ---- */
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry[0] = 0; entry[1] = 0;          // 0 表示 256
entry[2] = 0; entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12);

const outDir = path.join(__dirname, 'build');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icon.ico'), Buffer.concat([header, entry, png]));
console.log('icon.ico written', fs.statSync(path.join(outDir, 'icon.ico')).size, 'bytes');
