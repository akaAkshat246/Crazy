import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const officialSvgsDir = path.join(rootDir, 'static', 'social', 'official-svgs')
const outputIconsDir = path.join(rootDir, 'static', 'social', 'icons')
const distIconsDir = path.join(rootDir, 'dist', 'social', 'icons')

if (!fs.existsSync(outputIconsDir)) fs.mkdirSync(outputIconsDir, { recursive: true })
if (fs.existsSync(path.join(rootDir, 'dist', 'social')) && !fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true })
}

// Fetch official files if missing
const codolioRawSvg = fs.readFileSync(path.join(officialSvgsDir, 'codolio.svg'), 'utf8')
const codechefRawSvg = fs.readFileSync(path.join(officialSvgsDir, 'codechef.svg'), 'utf8')
const gfgRawSvg = fs.readFileSync(path.join(officialSvgsDir, 'geeksforgeeks.svg'), 'utf8')

// Extract paths
function extractPath(svgStr) {
    const match = svgStr.match(/<path\s+[^>]*d="([^"]+)"/i)
    return match ? match[1] : ''
}

const codechefPath = extractPath(codechefRawSvg)
const gfgPath = extractPath(gfgRawSvg)

const socialConfigs = [
    {
        id: 'github',
        name: 'GitHub',
        color: '#FFFFFF',
        tileBg: '#181b22',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#181b22" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
            <g transform="translate(106, 106) scale(12.5)">
                <path fill="#FFFFFF" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </g>
        </svg>`
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        color: '#0A66C2',
        tileBg: '#0A66C2',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#0A66C2" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
            <g fill="#FFFFFF" transform="translate(106, 95) scale(12.5)">
                <path d="M5.337 3.304c-1.144 0-2.063.926-2.063 2.065 0 1.138.92 2.063 2.063 2.063 1.14 0 2.064-.925 2.064-2.063 0-1.139-.925-2.065-2.064-2.065zm1.782 13.019H3.555V8.871h3.564v7.452z"/>
                <path d="M20.447 16.323h-3.554v-3.62c0-.864-.027-1.977-1.852-1.977-1.853 0-2.136.941-2.136 1.913v3.684H9.351V8.871h3.414v1.016h.046c.477-.586 1.637-1.205 3.37-1.205 3.601 0 4.267 1.543 4.267 3.551v4.09z"/>
            </g>
        </svg>`
    },
    {
        id: 'mail',
        name: 'Mail',
        color: '#EA4335',
        tileBg: '#FFFFFF',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#FFFFFF" stroke="rgba(0,0,0,0.08)" stroke-width="4"/>
            <g transform="translate(106, 116) scale(0.586)">
                <path d="M34.9 448h81.5V250.2L0 163v250.2C0 432.5 15.7 448 34.9 448" fill="#4285f4"/>
                <path d="M395.6 448h81.5c19.3 0 34.9-15.7 34.9-34.9V163l-116.4 87.3" fill="#34a853"/>
                <path d="M395.6 99v151.3L512 163v-46.5c0-43.2-49.3-67.8-83.8-41.9" fill="#fbbc04"/>
                <path d="M116.4 250.2V99L256 203.7 395.6 99v151.3L256 355" fill="#ea4335"/>
                <path d="M0 116.4V163l116.4 87.3V99L83.8 74.5C49.2 48.6 0 73.2 0 116.4" fill="#c5221f"/>
            </g>
        </svg>`
    },
    {
        id: 'instagram',
        name: 'Instagram',
        color: '#E4405F',
        tileBg: '#E4405F',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#FFDC80"/>
                    <stop offset="25%" stop-color="#F77737"/>
                    <stop offset="50%" stop-color="#F56040"/>
                    <stop offset="75%" stop-color="#E1306C"/>
                    <stop offset="100%" stop-color="#833AB4"/>
                </linearGradient>
            </defs>
            <rect width="512" height="512" rx="100" fill="url(#ig-grad)" stroke="rgba(255,255,255,0.15)" stroke-width="4"/>
            <g transform="translate(106, 106) scale(12.5)">
                <path fill="#FFFFFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </g>
        </svg>`
    },
    {
        id: 'leetcode',
        name: 'LeetCode',
        color: '#FFA116',
        tileBg: '#181b22',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#181b22" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
            <g transform="translate(136, 100) scale(2.6)">
                <path d="M67.507 83.066c2.494-2.49 6.53-2.483 7.016.015 2.486 2.498 2.479 6.542-.015 9.032l-11.073 11.057c-10.216 10.201-26.875 10.349-37.263.343-.06-.057-4.686-4.593-19.946-19.556C-3.925 73.998-4.936 58.07 4.617 47.842l17.812-19.072C31.91 18.618 49.387 17.508 60.228 26.275l16.177 13.083c2.74 2.216 3.168 6.237.956 8.981-2.212 2.744-6.226 3.173-8.965.957L52.219 36.213c-5.67-4.585-15.587-3.955-20.479 1.284L13.928 56.569c-4.65 4.979-4.141 13.001 1.218 18.256 11.205 10.988 19.841 19.456 19.851 19.465 5.401 5.202 14.134 5.124 19.437-.171l13.073-11.053z" fill="#FFA116"/>
                <path d="M40.607 72.001c-3.521 0-6.375-2.859-6.375-6.386 0-3.527 2.854-6.386 6.375-6.386h47.018c3.521 0 6.375 2.859 6.375 6.386 0 3.527-2.854 6.386-6.375 6.386H40.607z" fill="#B3B3B3"/>
                <path d="M49.412 2.023C51.818-.553 55.852-.687 58.423 1.723c2.571 2.41 2.705 6.451.3 9.027L15.928 56.573c-4.651 4.979-4.142 13.001 1.218 18.256L36.91 94.209c2.516 2.467 2.559 6.51.096 9.031-2.463 2.52-6.5 2.564-9.016.096L8.227 83.957C-1.925 74.002-2.936 58.074 6.618 47.846L49.412 2.023z" fill="#FFFFFF"/>
            </g>
        </svg>`
    },
    {
        id: 'codechef',
        name: 'CodeChef',
        color: '#5B4638',
        tileBg: '#5B4638',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#5B4638" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
            <g transform="translate(106, 106) scale(12.5)">
                <path fill="#FFFFFF" d="${codechefPath}"/>
            </g>
        </svg>`
    },
    {
        id: 'codolio',
        name: 'Codolio',
        color: '#3B82F6',
        tileBg: '#181b22',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#181b22" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
            <g transform="translate(86, 126) scale(2.88)">
                ${codolioRawSvg.replace(/<svg[^>]*>|<\/svg>/gi, '')}
            </g>
        </svg>`
    },
    {
        id: 'hackerrank',
        name: 'HackerRank',
        color: '#2EC866',
        tileBg: '#181b22',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#181b22" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
            <g transform="translate(106, 106) scale(12.5)">
                <rect width="24" height="24" rx="2" fill="#FFFFFF"/>
                <path fill="#2EC866" d="M0 0v24h24V0zm9.95 8.002h1.805c.061 0 .111.05.111.111v7.767c0 .061-.05.111-.11.111H9.95c-.061 0-.111-.05-.111-.11v-2.87H7.894v2.87c0 .06-.05.11-.11.11H5.976a.11.11 0 01-.11-.11V8.112c0-.06.05-.11.11-.11h1.806c.061 0 .11.05.11.11v2.869H9.84v-2.87c0-.06.05-.11.11-.11zm2.999 0h5.778c.061 0 .111.05.111.11v7.767a.11.11 0 01-.11.112h-5.78a.11.11 0 01-.11-.11V8.111c0-.06.05-.11.11-.11z"/>
            </g>
        </svg>`
    },
    {
        id: 'geeksforgeeks',
        name: 'GeeksforGeeks',
        color: '#2F8D46',
        tileBg: '#181b22',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#181b22" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
            <g transform="translate(106, 106) scale(12.5)">
                <path fill="#2F8D46" d="${gfgPath}"/>
            </g>
        </svg>`
    }
]

export async function buildSocialTiles() {
    console.log(`[Social Icons] Building ${socialConfigs.length} official social tiles...`)

    for (const item of socialConfigs) {
        const destStatic = path.join(outputIconsDir, `${item.id}.png`)
        await sharp(Buffer.from(item.svg))
            .resize(512, 512)
            .png({ quality: 95 })
            .toFile(destStatic)

        if (fs.existsSync(distIconsDir)) {
            const destDist = path.join(distIconsDir, `${item.id}.png`)
            fs.copyFileSync(destStatic, destDist)
        }

        console.log(`[Social Icons] Generated official tile: ${item.id}.png`)
    }

    const metadata = socialConfigs.map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
        tileBg: c.tileBg,
        icon: `social/icons/${c.id}.png`
    }))

    fs.writeFileSync(
        path.join(rootDir, 'static', 'social', 'social-metadata.json'),
        JSON.stringify(metadata, null, 2)
    )
    if (fs.existsSync(path.join(rootDir, 'dist', 'social'))) {
        fs.writeFileSync(
            path.join(rootDir, 'dist', 'social', 'social-metadata.json'),
            JSON.stringify(metadata, null, 2)
        )
    }
    console.log('[Social Icons] Updated social-metadata.json successfully.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    buildSocialTiles().catch(err => {
        console.error(err)
        process.exit(1)
    })
}
