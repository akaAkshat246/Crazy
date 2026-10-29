import fs from 'fs'

const code = fs.readFileSync('scraped_archive/index-ORr3L4no.js', 'utf8')
const regex = /WebSocket\(([^)]+)\)/g
let m
while ((m = regex.exec(code)) !== null) {
    const idx = m.index
    console.log('WebSocket call:', m[0], 'around:', code.slice(Math.max(0, idx - 100), idx + 100))
}
const m2 = code.match(/wss:\/\/[^\s"'`]+/g)
console.log('wss in scraped js:', m2)

const m3 = code.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s"'`]*/g)
const uniqueHosts = new Set()
if (m3) {
    m3.forEach(url => {
        try {
            uniqueHosts.add(new URL(url).origin)
        } catch {}
    })
}
console.log('Unique HTTP hosts in scraped js:', Array.from(uniqueHosts))
