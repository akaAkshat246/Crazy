import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const srcImagePath = 'C:/Users/ASUS/.gemini/antigravity/brain/ce8971a2-9500-4a28-b5d4-3676b3cccfe0/.user_uploaded/media_1793249541989_bd58e548.png'
const staticFaviconsDir = path.join(rootDir, 'static', 'favicons')
const distFaviconsDir = path.join(rootDir, 'dist', 'favicons')

if (!fs.existsSync(staticFaviconsDir)) fs.mkdirSync(staticFaviconsDir, { recursive: true })
if (fs.existsSync(path.join(rootDir, 'dist')) && !fs.existsSync(distFaviconsDir)) {
    fs.mkdirSync(distFaviconsDir, { recursive: true })
}

function createIco(pngBuffers) {
    const header = Buffer.alloc(6)
    header.writeUInt16LE(0, 0)
    header.writeUInt16LE(1, 2)
    header.writeUInt16LE(pngBuffers.length, 4)

    const dirSize = 16 * pngBuffers.length
    let offset = 6 + dirSize

    const dirBuffers = []
    for (const item of pngBuffers) {
        const entry = Buffer.alloc(16)
        entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0)
        entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1)
        entry.writeUInt8(0, 2)
        entry.writeUInt8(0, 3)
        entry.writeUInt16LE(1, 4)
        entry.writeUInt16LE(32, 6)
        entry.writeUInt32LE(item.buffer.length, 8)
        entry.writeUInt32LE(offset, 12)
        dirBuffers.push(entry)
        offset += item.buffer.length
    }

    return Buffer.concat([header, ...dirBuffers, ...pngBuffers.map(p => p.buffer)])
}

async function buildFavicons() {
    console.log('[Favicon Generator] Reading source image:', srcImagePath)
    if (!fs.existsSync(srcImagePath)) {
        throw new Error(`Source image not found: ${srcImagePath}`)
    }

    // Trim transparent outer padding and scale to 512x512 with 4% padding
    const trimmed = await sharp(srcImagePath).trim().toBuffer()
    const base512 = await sharp(trimmed)
        .resize(490, 490, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({
            top: 11,
            bottom: 11,
            left: 11,
            right: 11,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer()

    // 1. Generate size variants
    const sizes = [
        { name: 'favicon-96x96.png', size: 96 },
        { name: 'apple-touch-icon.png', size: 180 },
        { name: 'web-app-manifest-192x192.png', size: 192 },
        { name: 'web-app-manifest-512x512.png', size: 512 }
    ]

    for (const s of sizes) {
        const buf = await sharp(base512).resize(s.size, s.size).png().toBuffer()
        fs.writeFileSync(path.join(staticFaviconsDir, s.name), buf)
        if (fs.existsSync(distFaviconsDir)) {
            fs.writeFileSync(path.join(distFaviconsDir, s.name), buf)
        }
        console.log(`[Favicon Generator] Generated ${s.name} (${s.size}x${s.size})`)
    }

    // 2. Generate multi-resolution ICO (16x16, 32x32, 48x48)
    const icoSizes = [16, 32, 48]
    const icoPngBuffers = []
    for (const size of icoSizes) {
        const buf = await sharp(base512).resize(size, size).png().toBuffer()
        icoPngBuffers.push({ width: size, height: size, buffer: buf })
    }
    const icoBuffer = createIco(icoPngBuffers)
    fs.writeFileSync(path.join(staticFaviconsDir, 'favicon.ico'), icoBuffer)
    fs.writeFileSync(path.join(rootDir, 'static', 'favicon.ico'), icoBuffer)
    if (fs.existsSync(distFaviconsDir)) {
        fs.writeFileSync(path.join(distFaviconsDir, 'favicon.ico'), icoBuffer)
    }
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
        fs.writeFileSync(path.join(rootDir, 'dist', 'favicon.ico'), icoBuffer)
    }
    console.log('[Favicon Generator] Generated favicon.ico (16, 32, 48)')

    // 3. Generate favicon.svg embedding 512x512 base64
    const base64Png = base512.toString('base64')
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
    <image width="512" height="512" xlink:href="data:image/png;base64,${base64Png}"/>
</svg>`
    fs.writeFileSync(path.join(staticFaviconsDir, 'favicon.svg'), svgContent, 'utf8')
    if (fs.existsSync(distFaviconsDir)) {
        fs.writeFileSync(path.join(distFaviconsDir, 'favicon.svg'), svgContent, 'utf8')
    }
    console.log('[Favicon Generator] Generated favicon.svg')

    // 4. Update site.webmanifest
    const webmanifest = {
        name: "Akshat's Portfolio",
        short_name: "Akshat's",
        icons: [
            {
                src: "/favicons/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable"
            },
            {
                src: "/favicons/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ],
        theme_color: "#0a66c2",
        background_color: "#120d18",
        display: "standalone"
    }
    fs.writeFileSync(path.join(staticFaviconsDir, 'site.webmanifest'), JSON.stringify(webmanifest, null, 2), 'utf8')
    if (fs.existsSync(distFaviconsDir)) {
        fs.writeFileSync(path.join(distFaviconsDir, 'site.webmanifest'), JSON.stringify(webmanifest, null, 2), 'utf8')
    }
    console.log('[Favicon Generator] Generated site.webmanifest')
    console.log('[Favicon Generator] All favicons successfully created!')
}

buildFavicons().catch(err => {
    console.error(err)
    process.exit(1)
})

