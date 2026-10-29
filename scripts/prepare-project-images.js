import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'static/projects/images';

const projectSources = [
    {
        name: 'brawnsterdam',
        source: 'Brawnsterdam.png'
    },
    {
        name: 'abes-nexus',
        source: 'ABES.png'
    },
    {
        name: 'debug-assistant',
        source: 'Debug Assistant.png'
    },
    {
        name: 'aarogya-grid-ai',
        source: 'Aarogyagrid AI.png'
    },
    {
        name: 'watermap',
        source: 'Watermap.png'
    },
    {
        name: 'ha-x-baby',
        source: 'HaX Baby.png'
    },
    {
        name: 'my-project',
        source: 'My project.png'
    },
    {
        name: 'janamashtami',
        source: 'Janamashtami.png'
    }
];

async function processImages() {
    for (const p of projectSources) {
        if (!fs.existsSync(p.source)) {
            console.warn(`File not found: ${p.source}`);
            continue;
        }

        // Image 1: Main desktop view (960x540, top/center cover)
        const img1Path = path.join(outDir, `${p.name}-1.png`);
        await sharp(p.source)
            .resize(960, 540, { fit: 'cover', position: p.name === 'janamashtami' ? 'center' : 'top' })
            .png({ quality: 90 })
            .toFile(img1Path);
        console.log(`Created ${img1Path}`);

        // Image 2: Focused view (960x540, centered)
        const img2Path = path.join(outDir, `${p.name}-2.png`);
        await sharp(p.source)
            .resize(960, 540, { fit: 'cover', position: 'center' })
            .png({ quality: 90 })
            .toFile(img2Path);
        console.log(`Created ${img2Path}`);
    }

    // Clean up old christmas demo images if present
    ['christmas-demo-1.png', 'christmas-demo-2.png'].forEach(file => {
        const fp = path.join(outDir, file);
        if (fs.existsSync(fp)) {
            fs.unlinkSync(fp);
            console.log(`Deleted ${fp}`);
        }
    });
}

processImages();
