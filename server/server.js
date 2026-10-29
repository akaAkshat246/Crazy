import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import zlib from 'zlib'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')

const PORT = process.env.PORT || 8080

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ktx': 'image/ktx2',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.wasm': 'application/wasm',
    '.mp3': 'audio/mpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
}

const server = http.createServer((req, res) => {
    // Basic CORS & security headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')

    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }

    // Clean URL path
    const urlPath = req.url.split('?')[0]
    let filePath = path.join(distDir, decodeURIComponent(urlPath))

    // Check if target is a directory or file
    let stat
    try {
        stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            filePath = path.join(filePath, 'index.html')
            stat = fs.statSync(filePath)
        }
    } catch {
        // SPA Fallback for client routes
        filePath = path.join(distDir, 'index.html')
        try {
            stat = fs.statSync(filePath)
        } catch {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('Build directory (dist/) not found. Run npm run build first.')
            return
        }
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    // Support HTTP Range requests for audio streaming (.mp3)
    const range = req.headers.range
    if (range && ext === '.mp3') {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
        const chunksize = (end - start) + 1

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType
        })

        const stream = fs.createReadStream(filePath, { start, end })
        stream.pipe(res)
        return
    }

    // Cache-Control headers
    if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache')
    } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }

    res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
    })

    fs.createReadStream(filePath).pipe(res)
})

server.listen(PORT, () => {
    console.log(`\n========================================`)
    console.log(` Akshat Vats Portfolio Production Server Running!`)
    console.log(` Serving: ${distDir}`)
    console.log(` URL:     http://localhost:${PORT}`)
    console.log(`========================================\n`)
})

