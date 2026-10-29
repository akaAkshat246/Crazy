import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const brainDir = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/1569abee-ddac-46a2-9f03-0406afd4d8da'
const oldBrainDir = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/3d48bf03-daea-4ae8-bc7b-b187f609fe57'
const outDir = 'static/lab/images'

async function makeBookCover(coverPath, outBaseName) {
    // Height 500 in 960x540 canvas
    const coverHeight = 500
    const coverWidth = Math.round(coverHeight * (1024 / 1536)) // ~333

    const resizedCover = await sharp(coverPath)
        .resize(coverWidth, coverHeight, { fit: 'contain' })
        .toBuffer()

    // Create blurred background
    const bg = await sharp(coverPath)
        .resize(960, 540, { fit: 'cover' })
        .blur(25)
        .modulate({ brightness: 0.35, saturation: 0.8 })
        .toBuffer()

    // Composite cover onto background
    const left = Math.round((960 - coverWidth) / 2)
    const top = Math.round((540 - coverHeight) / 2)

    await sharp(bg)
        .composite([
            {
                input: resizedCover,
                left: left,
                top: top
            }
        ])
        .png()
        .toFile(path.join(outDir, `${outBaseName}.png`))

    // Mini
    await sharp(path.join(outDir, `${outBaseName}.png`))
        .resize(240, 136, { fit: 'cover' })
        .png()
        .toFile(path.join(outDir, `${outBaseName}-mini.png`))

    console.log(`Created ${outBaseName}.png and ${outBaseName}-mini.png`)
}

async function makeWebImage(sourcePath, outBaseName) {
    // 960 x 540
    await sharp(sourcePath)
        .resize(960, 540, { fit: 'cover' })
        .png()
        .toFile(path.join(outDir, `${outBaseName}.png`))

    // 240 x 136
    await sharp(path.join(outDir, `${outBaseName}.png`))
        .resize(240, 136, { fit: 'cover' })
        .png()
        .toFile(path.join(outDir, `${outBaseName}-mini.png`))

    console.log(`Created ${outBaseName}.png and ${outBaseName}-mini.png`)
}

async function run() {
    // Copy new high-res covers to static/lab/images
    const threadCoverSrc = path.join(brainDir, 'thread_cover_1793030990360.jpg')
    const zeroMeridianCoverSrc = path.join(brainDir, 'zero_meridian_cover_1793031024365.jpg')
    
    fs.copyFileSync(threadCoverSrc, path.join(outDir, 'Thread-cover.jpg'))
    fs.copyFileSync(zeroMeridianCoverSrc, path.join(outDir, 'Zero Meridian-cover.jpg'))

    // 1. Thread (Novel / Story by Akshat Vats)
    await makeBookCover(path.join(outDir, 'Thread-cover.jpg'), 'thread')

    // 2. Zero Meridian (Novel by Akshat Vats)
    await makeBookCover(path.join(outDir, 'Zero Meridian-cover.jpg'), 'zero-meridian')

    // 3. 27 Days for 53 Years (Novel by Akshat Vats)
    await makeWebImage(path.join(brainDir, 'twenty_seven_days_cover_1793030939397.jpg'), '27-days-for-53-years')

    // 4. Last Conversation (Novel by Akshat Vats)
    await makeWebImage(path.join(brainDir, 'last_conversation_cover_1793030885983.jpg'), 'last-conversation')

    // 5. Merry Christmas (kept intact)
    if(fs.existsSync(path.join(oldBrainDir, 'merry_christmas_1792940517339.jpg'))) {
        await makeWebImage(path.join(oldBrainDir, 'merry_christmas_1792940517339.jpg'), 'merry-christmas')
    }

    // 6. Happy New Year (kept intact)
    if(fs.existsSync(path.join(oldBrainDir, 'happy_new_year_1792940548505.jpg'))) {
        await makeWebImage(path.join(oldBrainDir, 'happy_new_year_1792940548505.jpg'), 'happy-new-year')
    }

    // 7. Friendship Day Surprise (kept intact)
    if(fs.existsSync(path.join(oldBrainDir, 'friendship_day_1792940578692.jpg'))) {
        await makeWebImage(path.join(oldBrainDir, 'friendship_day_1792940578692.jpg'), 'friendship-day')
    }

    console.log('All images updated with Akshat Vats successfully!')
}

run().catch(console.error)
