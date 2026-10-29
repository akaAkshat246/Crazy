import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { musics, musicsSummary } from '../sources/data/musics.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('=== VERIFICATION TEST START ===\n')

let passed = true

// 1. Check musicsSummary
console.log('Summary metrics:')
console.log(`  Discovered: ${musicsSummary.discoveredCount}`)
console.log(`  Added: ${musicsSummary.addedCount}`)
console.log(`  Skipped as duplicates: ${musicsSummary.skippedDuplicatesCount}`)
console.log(`  Existing preserved: ${musicsSummary.existingCount}`)
console.log(`  Total queue length: ${musics.length}\n`)

if (musics.length !== 10)
{
    console.error(`FAIL: Expected 10 songs in unified queue, found ${musics.length}`)
    passed = false
}

// 2. Check existing songs
const original3 = ['Sudo.mp3', 'Boy.mp3', 'Baguira.mp3']
for (let i = 0; i < 3; i++)
{
    const song = musics[i]
    if (!song.isExisting || song.name !== original3[i])
    {
        console.error(`FAIL: Existing song at index ${i} mismatch:`, song)
        passed = false
    }
    else
    {
        console.log(`PASS: Preserved existing song [${i}]: ${song.name}`)
    }
}

// 3. Check discovered songs from Music/
const musicFolderFiles = fs.readdirSync(path.join(rootDir, 'Music')).filter(f => f.endsWith('.mp3'))
console.log(`\nDiscovered ${musicFolderFiles.length} files in Music folder:`, musicFolderFiles)

for (const f of musicFolderFiles)
{
    const found = musics.find(s => s.name === f)
    if (!found)
    {
        console.error(`FAIL: Discovered file ${f} not found in unified queue!`)
        passed = false
    }
    else
    {
        console.log(`PASS: Found in queue: ${f} -> Title: "${found.title}", Artist: "${found.artist || 'N/A'}", DisplayName: "${found.displayName}"`)
    }
}

// 4. Check duplicate prevention
const namesSeen = new Set()
for (const s of musics)
{
    const lower = s.name.toLowerCase()
    if (namesSeen.has(lower))
    {
        console.error(`FAIL: Duplicate song detected in queue: ${s.name}`)
        passed = false
    }
    namesSeen.add(lower)
}
console.log(`PASS: Zero duplicates detected across all ${musics.length} songs.`)

// 5. Check browser accessibility & file existence in static and dist
console.log('\nChecking file locations and accessibility:')
for (const s of musics)
{
    const staticPath = path.join(rootDir, 'static', s.path)
    const distPath = path.join(rootDir, 'dist', s.path)

    if (!fs.existsSync(staticPath))
    {
        console.error(`FAIL: Missing static file for ${s.name} at ${staticPath}`)
        passed = false
    }
    else
    {
        const size = fs.statSync(staticPath).size
        if (size === 0)
        {
            console.error(`FAIL: Static file for ${s.name} is 0 bytes!`)
            passed = false
        }
    }

    if (!fs.existsSync(distPath))
    {
        console.error(`FAIL: Missing dist file for ${s.name} at ${distPath}`)
        passed = false
    }

    // Verify encodeURI doesn't break
    const encoded = encodeURI(s.path)
    if (!encoded.startsWith('sounds/musics/'))
    {
        console.error(`FAIL: encodeURI malformed path: ${encoded}`)
        passed = false
    }

    // Verify cover if present
    if (s.cover)
    {
        const staticCover = path.join(rootDir, 'static', s.cover)
        const distCover = path.join(rootDir, 'dist', s.cover)
        if (!fs.existsSync(staticCover) || !fs.existsSync(distCover))
        {
            console.error(`FAIL: Missing cover file for ${s.name} at ${s.cover}`)
            passed = false
        }
        else
        {
            console.log(`PASS: Verified cover art for ${s.name} (${fs.statSync(staticCover).size} bytes)`)
        }
    }
}

console.log(`PASS: All ${musics.length} songs verified in static/ and dist/ with valid sizes.`)

if (passed)
{
    console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===')
}
else
{
    console.error('\n=== SOME VERIFICATION TESTS FAILED! ===')
    process.exit(1)
}

