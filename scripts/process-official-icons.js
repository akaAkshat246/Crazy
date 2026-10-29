import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const officialSvgsDir = path.join('static', 'tech-arsenal', 'official-svgs');
const outputIconsDir = path.join('static', 'tech-arsenal', 'icons');

if (!fs.existsSync(outputIconsDir)) {
    fs.mkdirSync(outputIconsDir, { recursive: true });
}

// 25 Technologies in 4 Categories matching the reference screenshot exactly:
const configs = [
    // Languages and Core
    {
        id: 'javascript',
        name: 'JavaScript',
        category: 'Languages and Core',
        svg: 'javascript.svg',
        tileBg: '#F0DB4F',
        iconScale: 0.96, // Fills tile with rounded corners
        color: '#F0DB4F'
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        category: 'Languages and Core',
        svg: 'typescript.svg',
        tileBg: '#3178C6',
        iconScale: 0.96,
        color: '#3178C6'
    },
    {
        id: 'python',
        name: 'Python',
        category: 'Languages and Core',
        svg: 'python.svg',
        tileBg: '#181b22',
        iconScale: 0.68,
        color: '#3776AB'
    },
    {
        id: 'cpp',
        name: 'C++',
        category: 'Languages and Core',
        svg: 'cpp.svg',
        tileBg: '#00599C',
        iconScale: 0.94,
        color: '#00599C'
    },
    {
        id: 'html5',
        name: 'HTML5',
        category: 'Languages and Core',
        svg: 'html5.svg',
        tileBg: '#E44D26',
        iconScale: 0.72,
        color: '#E44D26'
    },
    {
        id: 'css3',
        name: 'CSS3',
        category: 'Languages and Core',
        svg: 'css3.svg',
        tileBg: '#1572B6',
        iconScale: 0.72,
        color: '#1572B6'
    },

    // Frontend Engineering
    {
        id: 'react',
        name: 'React',
        category: 'Frontend Engineering',
        svg: 'react.svg',
        tileBg: '#181b22',
        iconScale: 0.72,
        color: '#61DAFB'
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        category: 'Frontend Engineering',
        svg: 'nextjs.svg',
        tileBg: '#181b22',
        iconScale: 0.72,
        color: '#FFFFFF'
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        category: 'Frontend Engineering',
        svg: 'tailwind.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#06B6D4'
    },
    {
        id: 'threejs',
        name: 'Three.js',
        category: 'Frontend Engineering',
        svg: 'threejs.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#FFFFFF',
        invertToWhite: true
    },
    {
        id: 'redux',
        name: 'Redux',
        category: 'Frontend Engineering',
        svg: 'redux.svg',
        tileBg: '#764ABC',
        iconScale: 0.72,
        color: '#764ABC',
        invertToWhite: true
    },
    {
        id: 'vite',
        name: 'Vite',
        category: 'Frontend Engineering',
        svg: 'vite.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#646CFF'
    },

    // Backend, Cloud and Edge
    {
        id: 'nodejs',
        name: 'Node.js',
        category: 'Backend, Cloud and Edge',
        svg: 'nodejs.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#339933'
    },
    {
        id: 'express',
        name: 'Express',
        category: 'Backend, Cloud and Edge',
        svg: 'express.svg',
        tileBg: '#181b22',
        iconScale: 0.74,
        color: '#FFFFFF',
        invertToWhite: true
    },
    {
        id: 'cloudflare',
        name: 'Cloudflare',
        category: 'Backend, Cloud and Edge',
        svg: 'cloudflare.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#F38020'
    },
    {
        id: 'gcp',
        name: 'Google Cloud',
        category: 'Backend, Cloud and Edge',
        svg: 'gcp.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#4285F4'
    },
    {
        id: 'vercel',
        name: 'Vercel',
        category: 'Backend, Cloud and Edge',
        svg: 'vercel.svg',
        tileBg: '#181b22',
        iconScale: 0.65,
        color: '#FFFFFF',
        invertToWhite: true
    },
    {
        id: 'postman',
        name: 'Postman',
        category: 'Backend, Cloud and Edge',
        svg: 'postman.svg',
        tileBg: '#FF6C37',
        iconScale: 0.74,
        color: '#FF6C37',
        invertToWhite: true
    },

    // Databases and DevOps Tools
    {
        id: 'mongodb',
        name: 'MongoDB',
        category: 'Databases and DevOps Tools',
        svg: 'mongodb.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#47A248'
    },
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        category: 'Databases and DevOps Tools',
        svg: 'postgresql.svg',
        tileBg: '#181b22',
        iconScale: 0.72,
        color: '#4169E1'
    },
    {
        id: 'git',
        name: 'Git',
        category: 'Databases and DevOps Tools',
        svg: 'git.svg',
        tileBg: '#FFFFFF',
        iconScale: 0.82,
        color: '#F05032',
        isGit: false
    },
    {
        id: 'github',
        name: 'GitHub',
        category: 'Databases and DevOps Tools',
        svg: 'github.svg',
        tileBg: '#181b22',
        iconScale: 0.72,
        color: '#FFFFFF',
        invertToWhite: true
    },
    {
        id: 'docker',
        name: 'Docker',
        category: 'Databases and DevOps Tools',
        svg: 'docker.svg',
        tileBg: '#2496ED',
        iconScale: 0.74,
        color: '#2496ED',
        invertToWhite: true
    },
    {
        id: 'linux',
        name: 'Linux',
        category: 'Databases and DevOps Tools',
        svg: 'linux.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#FCC624'
    },
    {
        id: 'figma',
        name: 'Figma',
        category: 'Databases and DevOps Tools',
        svg: 'figma.svg',
        tileBg: '#181b22',
        iconScale: 0.70,
        color: '#F24E1E'
    }
];

async function buildOfficialTiles() {
    const size = 512;
    const cornerRadius = 96;

    for (const item of configs) {
        const svgPath = path.join(officialSvgsDir, item.svg);
        let svgContent = fs.readFileSync(svgPath, 'utf8');

        // Apply dark mode white transformation if requested
        if (item.id === 'github') {
            svgContent = svgContent.replace(/fill="#181616"/g, 'fill="#FFFFFF"');
        } else if (item.id === 'express') {
            svgContent = svgContent.replace(/<path /g, '<path fill="#FFFFFF" ');
        } else if (item.id === 'threejs') {
            svgContent = svgContent.replace(/<g [^>]+>/, '<g fill="#FFFFFF" stroke="#FFFFFF" color="#FFFFFF">');
            svgContent = svgContent.replace(/color="#000"/g, 'color="#FFFFFF"');
            svgContent = svgContent.replace(/#000/g, '#FFFFFF');
            svgContent = svgContent.replace(/<path /g, '<path fill="#FFFFFF" ');
        } else if (item.id === 'vercel') {
            svgContent = svgContent.replace(/<path /g, '<path fill="#FFFFFF" ');
        } else if (item.id === 'redux') {
            svgContent = svgContent.replace(/fill="#764abc"/g, 'fill="#FFFFFF"');
        } else if (item.id === 'docker') {
            svgContent = svgContent.replace(/fill="[^"]+"/g, 'fill="#FFFFFF"');
        } else if (item.id === 'vite') {
            // Official full-color Vite logo (purple/cyan V with yellow lightning bolt)
            svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <defs>
                    <linearGradient id="vite-a" x1="1.9%" x2="58.8%" y1="65.4%" y2="21.5%"><stop offset="0%" stop-color="#41D1FF"/><stop offset="100%" stop-color="#BD34FE"/></linearGradient>
                    <linearGradient id="vite-b" x1="28.7%" x2="65.3%" y1="0%" y2="65.4%"><stop offset="0%" stop-color="#FFEA83"/><stop offset="8.3%" stop-color="#FFDD35"/><stop offset="100%" stop-color="#FFA800"/></linearGradient>
                </defs>
                <path fill="url(#vite-a)" d="M125.1 18.2 68.6 123.6a6 6 0 0 1-10.7-.1L2.9 18.2a6 6 0 0 1 6.5-8.8l52.6 10.5a6 6 0 0 0 2.4 0l54.2-10.5a6 6 0 0 1 6.5 8.8z"/>
                <path fill="url(#vite-b)" d="M82.2 2.6 37.7 44.8a2 2 0 0 0 1.4 3.4h22.4l-8.6 42.8a2 2 0 0 0 3.3 1.8l47.8-49.4a2 2 0 0 0-1.4-3.4H80.2l6.2-38.2a2 2 0 0 0-4.2-1.8z"/>
            </svg>`;
        }

        // Special handling for Git: white diamond backing under red-orange branch
        if (item.isGit) {
            svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <!-- White inner backing for branches -->
                <path fill="#FFFFFF" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/>
                <!-- Orange-red diamond with cutout -->
                <path fill="#F05032" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/>
            </svg>`;
        }

        const innerDim = Math.round(size * item.iconScale);
        const iconBuffer = await sharp(Buffer.from(svgContent))
            .resize(innerDim, innerDim, { fit: 'inside' })
            .toBuffer();

        // Outer squircle container
        const bgSvg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="${size - 16}" height="${size - 16}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${item.tileBg}" stroke="rgba(255,255,255,0.09)" stroke-width="4" />
        </svg>`;

        const bgBuffer = await sharp(Buffer.from(bgSvg)).toBuffer();

        const meta = await sharp(iconBuffer).metadata();
        const left = Math.round((size - meta.width) / 2);
        const top = Math.round((size - meta.height) / 2);

        // Clip the composite inside squircle mask so edge-to-edge icons (JS, TS, C++) have rounded corners
        const maskSvg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="${size - 16}" height="${size - 16}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#FFFFFF" />
        </svg>`;
        const maskBuffer = await sharp(Buffer.from(maskSvg)).toBuffer();

        const composited = await sharp(bgBuffer)
            .composite([{ input: iconBuffer, left, top }])
            .toBuffer();

        const finalTile = await sharp(composited)
            .composite([{ input: maskBuffer, blend: 'dest-in' }])
            .png()
            .toBuffer();

        const destFile = path.join(outputIconsDir, `${item.id}.png`);
        fs.writeFileSync(destFile, finalTile);
        console.log(`Generated official tile: ${item.id}.png`);
    }

    // Save tech-data.json
    fs.writeFileSync(
        path.join('static', 'tech-arsenal', 'tech-data.json'),
        JSON.stringify(configs, null, 2)
    );
    console.log('Saved updated static/tech-arsenal/tech-data.json');
}

buildOfficialTiles().catch(console.error);
