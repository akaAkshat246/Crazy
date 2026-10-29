import fs from 'fs'
import path from 'path'

const oldTokens = ['bruno', 'simon']
const matches = []

function searchDir(dir) {
    if (!fs.existsSync(dir)) return
    for (const f of fs.readdirSync(dir)) {
        if (f === 'node_modules' || f === '.git' || f === 'scraped_archive' || f === 'dist' || f === 'resources') continue
        const full = path.join(dir, f)
        const stat = fs.statSync(full)
        if (stat.isDirectory()) {
            searchDir(full)
        } else if (f !== 'audit-branding.js' && (f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.styl') || f.endsWith('.css') || f.endsWith('.env') || f.endsWith('.md'))) {
            const content = fs.readFileSync(full, 'utf8')
            const lines = content.split('\n')
            lines.forEach((line, idx) => {
                if (new RegExp(oldTokens.join('|'), 'i').test(line)) {
                    matches.push(`${full}:${idx + 1}: ${line.trim()}`)
                }
            })
        }
    }
}

searchDir('sources')
searchDir('static')
searchDir('scripts')
;['package.json', 'package-lock.json', '.env', '.env.example', '.env.production', 'vite.config.js', 'readme.md', 'license.md'].forEach(f => {
    if (fs.existsSync(f)) {
        const lines = fs.readFileSync(f, 'utf8').split('\n')
        lines.forEach((line, idx) => {
            if (new RegExp(oldTokens.join('|'), 'i').test(line)) {
                matches.push(`${f}:${idx + 1}: ${line.trim()}`)
            }
        })
    }
})

console.log('Total outdated references found:', matches.length)
matches.forEach(m => console.log(m))
