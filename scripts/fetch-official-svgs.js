import fs from 'fs'
import path from 'path'

const dir = 'static/social/official-svgs'
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}

const list = [
    { id: 'github', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/github.svg' },
    { id: 'linkedin', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/linkedin.svg' },
    { id: 'leetcode', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/leetcode.svg' },
    { id: 'codechef', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/codechef.svg' },
    { id: 'hackerrank', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/hackerrank.svg' },
    { id: 'geeksforgeeks', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/geeksforgeeks.svg' },
    { id: 'instagram', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/instagram.svg' },
    { id: 'gmail', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/gmail.svg' },
    { id: 'codolio', url: 'https://codolio.com/codolio_assets/codolio.svg' }
]

async function run() {
    for (const item of list) {
        try {
            const res = await fetch(item.url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const text = await res.text()
            const dest = path.join(dir, `${item.id}.svg`)
            fs.writeFileSync(dest, text, 'utf8')
            console.log(`Fetched & saved: ${item.id} (${text.length} bytes)`)
        } catch (e) {
            console.error(`Failed ${item.id}:`, e.message)
        }
    }
}

run()

