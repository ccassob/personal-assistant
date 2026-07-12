// Generates solid-teal PNG icons: public/icons/icon-192x192.png and icon-512x512.png
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

function crc32(buf) {
  let table = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    table[i] = c
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function makePng(size, r, g, b) {
  const sig = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2
  const row = Buffer.alloc(1 + size * 3)
  for (let x = 0; x < size; x++) { row[1 + x*3] = r; row[2 + x*3] = g; row[3 + x*3] = b }
  const raw = Buffer.concat(Array.from({length: size}, () => row))
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

const outDir = path.join(__dirname, 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })
// Teal #1ab394 => R:26 G:179 B:148
fs.writeFileSync(path.join(outDir, 'icon-192x192.png'), makePng(192, 26, 179, 148))
fs.writeFileSync(path.join(outDir, 'icon-512x512.png'), makePng(512, 26, 179, 148))
console.log('Icons generated.')
