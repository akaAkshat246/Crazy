import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Existing songs configured in the project
const EXISTING_SONGS = [
    {
        name: 'Sudo.mp3',
        path: 'sounds/musics/Sudo.mp3',
        title: 'Sudo',
        artist: 'Kounine',
        displayName: 'Sudo - Kounine',
        format: 'mp3',
        isExisting: true
    },
    {
        name: 'Boy.mp3',
        path: 'sounds/musics/Boy.mp3',
        title: 'Boy',
        artist: 'Kounine',
        displayName: 'Boy - Kounine',
        format: 'mp3',
        isExisting: true
    },
    {
        name: 'Baguira.mp3',
        path: 'sounds/musics/Baguira.mp3',
        title: 'Baguira',
        artist: 'Kounine',
        displayName: 'Baguira - Kounine',
        format: 'mp3',
        isExisting: true
    }
]

const SUPPORTED_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'])

/**
 * Parse ID3v2 metadata & album art from an audio file buffer
 */
function parseID3v2(buffer)
{
    if(buffer.length < 10 || buffer.toString('utf8', 0, 3) !== 'ID3')
    {
        return {}
    }

    const version = buffer[3]
    const tagSize = ((buffer[6] & 0x7f) << 21) | ((buffer[7] & 0x7f) << 14) | ((buffer[8] & 0x7f) << 7) | (buffer[9] & 0x7f)
    const end = Math.min(buffer.length, 10 + tagSize)
    let offset = 10
    const tags = {}

    while(offset < end - 10)
    {
        const frameId = buffer.toString('latin1', offset, offset + 4)
        if(!/^[A-Z0-9]{4}$/.test(frameId))
            break

        let frameSize = 0
        if(version === 4)
        {
            frameSize = ((buffer[offset + 4] & 0x7f) << 21) | ((buffer[offset + 5] & 0x7f) << 14) | ((buffer[offset + 6] & 0x7f) << 7) | (buffer[offset + 7] & 0x7f)
        }
        else
        {
            frameSize = buffer.readUInt32BE(offset + 4)
        }

        offset += 10
        if(offset + frameSize > buffer.length)
            break

        if(frameId.startsWith('T') && frameId !== 'TXXX')
        {
            const encoding = buffer[offset]
            let str = ''
            const textBuf = buffer.subarray(offset + 1, offset + frameSize)
            if(encoding === 1)
            {
                str = textBuf.toString('utf16le')
            }
            else if(encoding === 2)
            {
                str = textBuf.swap16().toString('utf16le')
            }
            else if(encoding === 3)
            {
                str = textBuf.toString('utf8')
            }
            else
            {
                str = textBuf.toString('latin1')
            }
            tags[frameId] = str.replace(/[\0\uFEFF]/g, '').trim()
        }
        else if(frameId === 'APIC')
        {
            const frameData = buffer.subarray(offset, offset + frameSize)
            const textEncoding = frameData[0]
            let mimeEnd = 1
            while(mimeEnd < frameData.length && frameData[mimeEnd] !== 0)
                mimeEnd++
            const mimeType = frameData.toString('ascii', 1, mimeEnd)
            let descEnd = mimeEnd + 2
            if(textEncoding === 1 || textEncoding === 2)
            {
                while(descEnd < frameData.length - 1 && !(frameData[descEnd] === 0 && frameData[descEnd + 1] === 0))
                    descEnd += 2
                descEnd += 2
            }
            else
            {
                while(descEnd < frameData.length && frameData[descEnd] !== 0)
                    descEnd++
                descEnd += 1
            }
            const imgData = frameData.subarray(descEnd)
            tags['APIC'] = { mimeType, buffer: imgData }
        }

        offset += frameSize
    }

    return tags
}

/**
 * Scan directory recursively for audio files
 */
function scanAudioFiles(dir, fileList = [])
{
    if(!fs.existsSync(dir))
        return fileList

    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for(const entry of entries)
    {
        const fullPath = path.join(dir, entry.name)
        if(entry.isDirectory())
        {
            scanAudioFiles(fullPath, fileList)
        }
        else if(entry.isFile())
        {
            const ext = path.extname(entry.name).toLowerCase()
            if(SUPPORTED_EXTENSIONS.has(ext))
            {
                fileList.push({
                    fullPath,
                    fileName: entry.name,
                    ext
                })
            }
        }
    }
    return fileList
}

/**
 * Clean up title text by removing promotional video/audio tags
 */
function cleanTitle(title, artist)
{
    if(!title)
        return ''
    let cleaned = title
        .replace(/\s*\((Official Audio|Official Video|Audio|Lyric Video|Lyrics|HQ|HD|Official)\)/gi, '')
        .replace(/\s*\[(Official Audio|Official Video|Audio|Lyric Video|Lyrics|HQ|HD|Official)\]/gi, '')
        .trim()

    if(artist && cleaned.toLowerCase().startsWith(artist.toLowerCase() + ' - '))
    {
        cleaned = cleaned.substring(artist.length + 3).trim()
    }

    return cleaned
}

/**
 * Synchronize music files from project music folder to static/sounds/musics
 */
export function syncMusic()
{
    const musicDir = path.resolve(rootDir, 'Music')
    const targetSoundsMusicsDir = path.resolve(rootDir, 'static', 'sounds', 'musics')
    const targetCoversDir = path.resolve(targetSoundsMusicsDir, 'covers')
    const distSoundsMusicsDir = path.resolve(rootDir, 'dist', 'sounds', 'musics')
    const distCoversDir = path.resolve(distSoundsMusicsDir, 'covers')

    if(!fs.existsSync(targetSoundsMusicsDir))
    {
        fs.mkdirSync(targetSoundsMusicsDir, { recursive: true })
    }
    if(!fs.existsSync(targetCoversDir))
    {
        fs.mkdirSync(targetCoversDir, { recursive: true })
    }

    const distExists = fs.existsSync(path.resolve(rootDir, 'dist'))
    if(distExists)
    {
        if(!fs.existsSync(distSoundsMusicsDir))
            fs.mkdirSync(distSoundsMusicsDir, { recursive: true })
        if(!fs.existsSync(distCoversDir))
            fs.mkdirSync(distCoversDir, { recursive: true })
    }

    // 1. Scan Music folder
    const discoveredFiles = scanAudioFiles(musicDir)

    // Build map of existing songs to detect duplicates
    const existingNames = new Set(EXISTING_SONGS.map(s => s.name.toLowerCase()))
    for(const song of EXISTING_SONGS)
    {
        const base = path.basename(song.name, path.extname(song.name)).toLowerCase()
        existingNames.add(base)
    }

    const addedSongs = []
    let skippedDuplicatesCount = 0

    // Process each discovered file
    for(const file of discoveredFiles)
    {
        const baseName = path.basename(file.fileName, file.ext)
        const lowerName = file.fileName.toLowerCase()
        const lowerBase = baseName.toLowerCase()

        // Check for duplicates with existing songs
        if(existingNames.has(lowerName) || existingNames.has(lowerBase))
        {
            skippedDuplicatesCount++
            continue
        }

        // Check if duplicate of already added song in this scan
        if(addedSongs.some(s => s.name.toLowerCase() === lowerName || path.basename(s.name, path.extname(s.name)).toLowerCase() === lowerBase))
        {
            skippedDuplicatesCount++
            continue
        }

        // Copy audio file to static/sounds/musics
        const targetPath = path.join(targetSoundsMusicsDir, file.fileName)
        if(!fs.existsSync(targetPath) || fs.statSync(file.fullPath).size !== fs.statSync(targetPath).size)
        {
            fs.copyFileSync(file.fullPath, targetPath)
        }

        // Also copy to dist if dist exists
        if(distExists)
        {
            const distTargetPath = path.join(distSoundsMusicsDir, file.fileName)
            if(!fs.existsSync(distTargetPath) || fs.statSync(file.fullPath).size !== fs.statSync(distTargetPath).size)
            {
                fs.copyFileSync(file.fullPath, distTargetPath)
            }
        }

        // Read file buffer for metadata & cover art
        const buffer = fs.readFileSync(file.fullPath)
        const id3 = parseID3v2(buffer)

        let artist = id3.TPE1 || id3.TPE2 || id3.TOPE || ''
        if(artist === 'David Guetta/Sia')
            artist = 'David Guetta ft. Sia'

        let rawTitle = id3.TIT2 || ''
        let title = cleanTitle(rawTitle, artist)

        if(!title)
        {
            // Fallback: generate readable title from filename
            title = baseName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
        }

        // Check for embedded album art
        let coverPath = null
        if(id3.APIC && id3.APIC.buffer && id3.APIC.buffer.length > 0)
        {
            let coverExt = '.jpg'
            if(id3.APIC.mimeType.includes('png'))
                coverExt = '.png'
            else if(id3.APIC.mimeType.includes('webp'))
                coverExt = '.webp'

            const coverFileName = `${baseName}${coverExt}`
            const coverDest = path.join(targetCoversDir, coverFileName)
            fs.writeFileSync(coverDest, id3.APIC.buffer)

            if(distExists)
            {
                const distCoverDest = path.join(distCoversDir, coverFileName)
                fs.writeFileSync(distCoverDest, id3.APIC.buffer)
            }

            coverPath = `sounds/musics/covers/${coverFileName}`
        }

        let displayName = title
        if(artist)
        {
            displayName = `${title} - ${artist}`
        }

        addedSongs.push({
            name: file.fileName,
            path: `sounds/musics/${file.fileName}`,
            title,
            artist,
            displayName,
            cover: coverPath,
            format: file.ext.replace('.', ''),
            isExisting: false
        })
    }

    // Sort added songs alphabetically for consistent queue ordering
    addedSongs.sort((a, b) => a.title.localeCompare(b.title))

    // Unified songs collection: preserved existing songs followed by newly added songs
    const unifiedSongs = [ ...EXISTING_SONGS, ...addedSongs ]

    const summary = {
        discoveredCount: discoveredFiles.length,
        addedCount: addedSongs.length,
        skippedDuplicatesCount,
        existingCount: EXISTING_SONGS.length,
        totalCount: unifiedSongs.length
    }

    // Write sources/data/musics.js
    const musicsDataFilePath = path.resolve(rootDir, 'sources', 'data', 'musics.js')
    const content = `// Auto-generated by scripts/sync-music.js
export const musics = ${JSON.stringify(unifiedSongs, null, 4)}

export const musicsSummary = ${JSON.stringify(summary, null, 4)}

export default musics
`
    fs.writeFileSync(musicsDataFilePath, content, 'utf8')

    console.log(`[sync-music] Scan completed:`)
    console.log(`  Discovered: ${summary.discoveredCount}`)
    console.log(`  Added: ${summary.addedCount}`)
    console.log(`  Skipped duplicates: ${summary.skippedDuplicatesCount}`)
    console.log(`  Existing preserved: ${summary.existingCount}`)
    console.log(`  Total in queue: ${summary.totalCount}`)

    return { unifiedSongs, summary }
}

// If executed directly from command line
if(process.argv[1] && path.resolve(process.argv[1]) === __filename)
{
    syncMusic()
}

