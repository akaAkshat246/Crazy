import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = 'static/tech-arsenal/icons';
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Map of 25 tech icons matching the user's image exactly
const icons = [
    // 1. Languages and Core
    {
        id: 'js',
        name: 'JavaScript',
        category: 'Languages and Core',
        color: '#F7DF1E',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#F7DF1E"/>
            <path d="M120 370c15 25 35 40 68 40 32 0 52-16 52-38 0-26-21-36-56-51-49-21-81-47-81-102 0-51 39-89 101-89 44 0 76 16 97 53l-45 29c-12-21-26-31-52-31-24 0-41 15-41 34 0 24 16 33 52 48 56 24 86 49 86 106 0 61-48 95-112 95-58 0-98-28-119-67l50-27z" fill="#000000" transform="translate(130, 0)"/>
            <path d="M170 135h60v190c0 45-25 65-68 65-38 0-60-18-72-40l48-28c8 14 16 21 32 21 16 0 28-7 28-35V135z" fill="#000000" transform="translate(-40, 0)"/>
        </svg>`
    },
    {
        id: 'ts',
        name: 'TypeScript',
        category: 'Languages and Core',
        color: '#3178C6',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#3178C6"/>
            <rect x="110" y="145" width="130" height="42" fill="#FFFFFF"/>
            <rect x="154" y="145" width="42" height="235" fill="#FFFFFF"/>
            <path d="M280 345c15 23 35 38 68 38 32 0 52-16 52-38 0-26-21-36-56-51-49-21-81-47-81-102 0-51 39-89 101-89 44 0 76 16 97 53l-45 29c-12-21-26-31-52-31-24 0-41 15-41 34 0 24 16 33 52 48 56 24 86 49 86 106 0 61-48 95-112 95-58 0-98-28-119-67l50-27z" fill="#FFFFFF"/>
        </svg>`
    },
    {
        id: 'python',
        name: 'Python',
        category: 'Languages and Core',
        color: '#3776AB',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#18202F"/>
            <g transform="translate(106, 106) scale(0.6)">
                <path d="M246.5 0c-132.8 0-124.5 57.6-124.5 57.6l.1 59.7h126.7v18H75.5S0 126.8 0 259.6c0 132.9 65.5 128.2 65.5 128.2h39.1v-54.8s-2.1-65.5 64.3-65.5h125.7s62.2 1 62.2-61.1V61.1S364 0 246.5 0zm-68.4 39.5c12.7 0 23 10.3 23 23s-10.3 23-23 23-23-10.3-23-23 10.3-23 23-23z" fill="#387EB8"/>
                <path d="M253.5 500c132.8 0 124.5-57.6 124.5-57.6l-.1-59.7H251.2v-18h173.3s75.5 8.5 75.5-124.3c0-132.9-65.5-128.2-65.5-128.2h-39.1v54.8s2.1 65.5-64.3 65.5H205.4s-62.2-1-62.2 61.1v145.4s-7.2 61.1 110.3 61.1zm68.4-39.5c-12.7 0-23-10.3-23-23s10.3-23 23-23 23 10.3 23 23-10.3 23-23 23z" fill="#FFE873"/>
            </g>
        </svg>`
    },
    {
        id: 'cpp',
        name: 'C++',
        category: 'Languages and Core',
        color: '#00599C',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#00599C"/>
            <circle cx="210" cy="256" r="130" fill="none" stroke="#FFFFFF" stroke-width="45"/>
            <path d="M190 190h150v132H190z" fill="#00599C"/>
            <g fill="#FFFFFF">
                <rect x="330" y="242" width="50" height="18" rx="4"/>
                <rect x="346" y="226" width="18" height="50" rx="4"/>
                <rect x="395" y="242" width="50" height="18" rx="4"/>
                <rect x="411" y="226" width="18" height="50" rx="4"/>
            </g>
        </svg>`
    },
    {
        id: 'html5',
        name: 'HTML5',
        category: 'Languages and Core',
        color: '#E34F26',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#E34F26"/>
            <g transform="translate(106, 80) scale(0.6)">
                <path d="M0 0l46 450 204 50 204-50 46-450H0z" fill="#E44D26"/>
                <path d="M250 460l170-42 38-380H250v422z" fill="#F16529"/>
                <path d="M250 180h-90l-7-80h197l-3-40H80l20 200h150v-80zm0 140l-80-22-5-60h-40l8 100 117 32v-50z" fill="#EBEBEB"/>
                <path d="M250 180v-40h100l3-40H250V60h170l-16 160H250zm0 140v50l117-32 10-120h-42l-6 70-79 22z" fill="#FFFFFF"/>
            </g>
        </svg>`
    },
    {
        id: 'css3',
        name: 'CSS3',
        category: 'Languages and Core',
        color: '#1572B6',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#1572B6"/>
            <g transform="translate(106, 80) scale(0.6)">
                <path d="M0 0l46 450 204 50 204-50 46-450H0z" fill="#1572B6"/>
                <path d="M250 460l170-42 38-380H250v422z" fill="#33A9DC"/>
                <path d="M250 180h-90l-7-80h197l-3-40H80l20 200h150v-80zm0 140l-80-22-5-60h-40l8 100 117 32v-50z" fill="#EBEBEB"/>
                <path d="M250 180v-40h100l3-40H250V60h170l-16 160H250zm0 140v50l117-32 10-120h-42l-6 70-79 22z" fill="#FFFFFF"/>
            </g>
        </svg>`
    },

    // 2. Frontend Engineering
    {
        id: 'react',
        name: 'React',
        category: 'Frontend Engineering',
        color: '#61DAFB',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(256, 256)" stroke="#61DAFB" stroke-width="20" fill="none">
                <circle cx="0" cy="0" r="32" fill="#61DAFB" stroke="none"/>
                <ellipse rx="170" ry="65"/>
                <ellipse rx="170" ry="65" transform="rotate(60)"/>
                <ellipse rx="170" ry="65" transform="rotate(120)"/>
            </g>
        </svg>`
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        category: 'Frontend Engineering',
        color: '#000000',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <circle cx="256" cy="256" r="170" fill="#000000" stroke="#333333" stroke-width="8"/>
            <path d="M210 160v192h36V220l106 142h28V160h-36v132L238 160h-28z" fill="#FFFFFF"/>
        </svg>`
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        category: 'Frontend Engineering',
        color: '#38BDF8',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(76, 150) scale(0.7)" fill="#38BDF8">
                <path d="M256 70c-68 0-113 34-135 102 27-34 59-47 95-38 20 5 35 20 51 37 26 27 57 58 124 58 68 0 113-34 135-102-27 34-59 47-95 38-20-5-35-20-51-37-26-27-57-58-124-58zm-127 150c-68 0-113 34-135 102 27-34 59-47 95-38 20 5 35 20 51 37 26 27 57 58 124 58 68 0 113-34 135-102-27 34-59 47-95 38-20-5-35-20-51-37-26-27-57-58-124-58z"/>
            </g>
        </svg>`
    },
    {
        id: 'threejs',
        name: 'Three.js',
        category: 'Frontend Engineering',
        color: '#000000',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(146, 120) scale(0.9)" stroke="#FFFFFF" stroke-width="12" fill="none">
                <path d="M120 20 L20 220 L220 220 Z"/>
                <path d="M120 20 L70 120 L170 120 Z"/>
                <path d="M70 120 L120 220 L170 120 Z"/>
                <path d="M20 220 L70 120 L120 220 Z"/>
                <path d="M220 220 L170 120 L120 220 Z"/>
            </g>
        </svg>`
    },
    {
        id: 'redux',
        name: 'Redux',
        category: 'Frontend Engineering',
        color: '#764ABC',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#764ABC"/>
            <g transform="translate(106, 106) scale(0.6)" fill="none" stroke="#FFFFFF" stroke-width="26">
                <path d="M356 220c-15-70-65-115-135-115-85 0-145 68-145 151s60 151 145 151c72 0 125-48 138-122" stroke-linecap="round"/>
                <circle cx="360" cy="240" r="28" fill="#FFFFFF" stroke="none"/>
                <circle cx="150" cy="320" r="24" fill="#FFFFFF" stroke="none"/>
                <circle cx="230" cy="150" r="20" fill="#FFFFFF" stroke="none"/>
            </g>
        </svg>`
    },
    {
        id: 'vite',
        name: 'Vite',
        category: 'Frontend Engineering',
        color: '#646CFF',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#1E1E2E"/>
            <g transform="translate(116, 96) scale(0.55)">
                <path d="M495 106L266 510c-5 9-17 9-22 0L14 106c-6-10 2-23 14-21l231 43c1 0 3 0 4 0l218-43c12-2 20 11 14 21z" fill="#7C3AED"/>
                <path d="M344 38L186 266c-3 5 0 12 6 12h86l-46 138c-3 9 9 15 15 8l172-236c4-6-1-14-8-14h-82l45-88c4-8-4-16-10-8z" fill="#FFD62E"/>
            </g>
        </svg>`
    },

    // 3. Backend, Cloud and Edge
    {
        id: 'nodejs',
        name: 'Node.js',
        category: 'Backend, Cloud and Edge',
        color: '#339933',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(106, 96) scale(0.6)" fill="#68A063">
                <path d="M250 20l200 115v230L250 480 50 365V135L250 20z" fill="none" stroke="#68A063" stroke-width="36"/>
                <path d="M250 160c50 0 80 25 80 65 0 70-110 50-110 90 0 15 12 25 35 25 35 0 55-15 65-28l25 30c-18 22-48 38-90 38-50 0-75-30-75-65 0-75 110-55 110-92 0-14-12-23-35-23-30 0-50 12-62 25l-25-28c18-22 45-37 82-37z" fill="#68A063"/>
            </g>
        </svg>`
    },
    {
        id: 'express',
        name: 'Express',
        category: 'Backend, Cloud and Edge',
        color: '#000000',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <text x="256" y="320" font-size="200" font-family="Helvetica, Arial, sans-serif" font-weight="bold" text-anchor="middle" fill="#FFFFFF" letter-spacing="-10">ex</text>
        </svg>`
    },
    {
        id: 'cloudflare',
        name: 'Cloudflare',
        category: 'Backend, Cloud and Edge',
        color: '#F38020',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(106, 140) scale(0.6)">
                <path d="M320 80c-15-40-55-70-100-70-55 0-100 40-108 92-35 8-62 40-62 78 0 45 36 80 80 80h240c45 0 80-35 80-80 0-42-32-75-72-78-10-50-50-90-100-90-20 0-38 6-58 18v50z" fill="#F38020"/>
                <path d="M375 220l-12-35c-5-15-18-25-33-25h-50l20 60h75z" fill="#FAAD3F"/>
            </g>
        </svg>`
    },
    {
        id: 'gcp',
        name: 'Google Cloud',
        category: 'Backend, Cloud and Edge',
        color: '#4285F4',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(106, 140) scale(0.6)">
                <path d="M320 70c-25-45-72-70-120-65-45 5-85 35-100 80-45 5-80 45-80 95 0 55 45 100 100 100h240c55 0 100-45 100-100 0-48-35-90-82-98-15-40-50-70-95-72-7 0-15 0-23 2V70z" fill="#4285F4"/>
                <path d="M120 280h180c45 0 80-35 80-80 0-40-30-75-70-80l-20-2-8-18c-18-35-50-55-90-55-35 0-65 18-80 48l-8 18-20 2c-35 4-64 35-64 72 0 42 34 75 75 75z" fill="#EA4335"/>
                <path d="M250 145c25 0 48 12 60 35l10 18 20 2c30 4 50 28 50 58 0 32-28 60-60 60H160c-32 0-58-25-58-58 0-28 20-52 48-58l20-4 10-18c15-25 40-35 70-35z" fill="#FBBC04"/>
                <path d="M220 200c12 0 25 8 30 20l5 10 12 2c15 2 25 15 25 30 0 18-15 32-32 32h-80c-18 0-32-15-32-32 0-15 10-28 25-30l12-2 5-10c6-12 18-20 30-20z" fill="#34A853"/>
            </g>
        </svg>`
    },
    {
        id: 'vercel',
        name: 'Vercel',
        category: 'Backend, Cloud and Edge',
        color: '#000000',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <polygon points="256,120 400,370 112,370" fill="#FFFFFF"/>
        </svg>`
    },
    {
        id: 'postman',
        name: 'Postman',
        category: 'Backend, Cloud and Edge',
        color: '#FF6C37',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#FF6C37"/>
            <g transform="translate(116, 116) scale(0.55)" fill="#FFFFFF">
                <circle cx="250" cy="200" r="100"/>
                <path d="M150 280l-60 80 120-20-60-60zm200 0l60 80-120-20 60-60z"/>
                <circle cx="220" cy="180" r="16" fill="#FF6C37"/>
                <circle cx="280" cy="180" r="16" fill="#FF6C37"/>
                <path d="M200 230c25 20 75 20 100 0" stroke="#FF6C37" stroke-width="12" fill="none" stroke-linecap="round"/>
            </g>
        </svg>`
    },

    // 4. Databases and DevOps Tools
    {
        id: 'mongodb',
        name: 'MongoDB',
        category: 'Databases and DevOps Tools',
        color: '#47A248',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(186, 96) scale(0.65)" fill="#47A248">
                <path d="M110 0C100 80 0 200 0 310c0 90 60 170 110 200 50-30 110-110 110-200C220 200 120 80 110 0z"/>
                <path d="M110 20v480c-5-2-10-5-15-8-45-28-85-92-85-182 0-90 85-195 100-290z" fill="#4CAF50"/>
            </g>
        </svg>`
    },
    {
        id: 'postgres',
        name: 'PostgreSQL',
        category: 'Databases and DevOps Tools',
        color: '#336791',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(136, 126) scale(0.48)" fill="#336791" stroke="#FFFFFF" stroke-width="12">
                <path d="M250 50c-110 0-180 80-180 170 0 60 30 110 80 145v95l70-40c10 2 20 5 30 5 110 0 180-80 180-170S360 50 250 50z" fill="#336791"/>
                <circle cx="200" cy="180" r="20" fill="#FFFFFF"/>
                <circle cx="300" cy="180" r="20" fill="#FFFFFF"/>
                <path d="M190 280c40 30 80 30 120 0" fill="none" stroke-width="18"/>
            </g>
        </svg>`
    },
    {
        id: 'git',
        name: 'Git',
        category: 'Databases and DevOps Tools',
        color: '#F05032',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#F05032"/>
            <g transform="translate(256, 256) rotate(45) translate(-140, -140)" fill="none" stroke="#FFFFFF" stroke-width="28" stroke-linecap="round">
                <rect x="0" y="0" width="280" height="280" rx="40" fill="#F05032" stroke="#FFFFFF" stroke-width="0"/>
                <line x1="80" y1="200" x2="80" y2="80"/>
                <line x1="80" y1="140" x2="180" y2="100"/>
                <circle cx="80" cy="200" r="26" fill="#FFFFFF"/>
                <circle cx="80" cy="80" r="26" fill="#FFFFFF"/>
                <circle cx="180" cy="100" r="26" fill="#FFFFFF"/>
            </g>
        </svg>`
    },
    {
        id: 'github',
        name: 'GitHub',
        category: 'Databases and DevOps Tools',
        color: '#181717',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <path d="M256 90C165 90 90 165 90 256c0 73 47 135 113 157 8 2 11-4 11-8v-29c-46 10-56-22-56-22-8-19-19-24-19-24-15-10 1-10 1-10 17 1 25 17 25 17 15 25 39 18 48 14 2-11 6-18 11-22-37-4-76-18-76-82 0-18 7-33 17-45-2-4-7-21 2-44 0 0 14-4 46 17 13-4 28-5 42-5s29 1 42 5c32-21 46-17 46-17 9 23 4 40 2 44 11 12 17 27 17 45 0 64-39 78-76 82 6 5 12 16 12 32v47c0 4 3 10 12 8 66-22 113-84 113-157 0-91-75-166-166-166z" fill="#FFFFFF"/>
        </svg>`
    },
    {
        id: 'docker',
        name: 'Docker',
        category: 'Databases and DevOps Tools',
        color: '#2496ED',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#2496ED"/>
            <g transform="translate(86, 140) scale(0.7)" fill="#FFFFFF">
                <rect x="120" y="60" width="36" height="36" rx="4"/>
                <rect x="165" y="60" width="36" height="36" rx="4"/>
                <rect x="210" y="60" width="36" height="36" rx="4"/>
                <rect x="75" y="105" width="36" height="36" rx="4"/>
                <rect x="120" y="105" width="36" height="36" rx="4"/>
                <rect x="165" y="105" width="36" height="36" rx="4"/>
                <rect x="210" y="105" width="36" height="36" rx="4"/>
                <rect x="255" y="105" width="36" height="36" rx="4"/>
                <path d="M460 170c-15-5-50-2-70 15-20-10-50-15-70-10H20c-5 35 15 100 80 135 60 30 150 30 220 0 70-30 110-85 140-140z"/>
            </g>
        </svg>`
    },
    {
        id: 'linux',
        name: 'Linux',
        category: 'Databases and DevOps Tools',
        color: '#FCC624',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(156, 100) scale(0.4)">
                <!-- Tux Body -->
                <path d="M250 50c-60 0-100 45-100 120 0 35 10 70 20 100-30 20-60 55-60 110 0 75 55 120 140 120s140-45 140-120c0-55-30-90-60-110 10-30 20-65 20-100 0-75-40-120-100-120z" fill="#000000"/>
                <!-- Tux Belly -->
                <ellipse cx="250" cy="330" rx="90" ry="110" fill="#FFFFFF"/>
                <!-- Tux Face -->
                <ellipse cx="215" cy="140" rx="15" ry="25" fill="#FFFFFF"/>
                <ellipse cx="285" cy="140" rx="15" ry="25" fill="#FFFFFF"/>
                <circle cx="218" cy="145" r="8" fill="#000000"/>
                <circle cx="282" cy="145" r="8" fill="#000000"/>
                <!-- Beak -->
                <polygon points="210,175 290,175 250,225" fill="#FFA500"/>
                <!-- Feet -->
                <ellipse cx="160" cy="480" rx="60" ry="25" fill="#FFA500"/>
                <ellipse cx="340" cy="480" rx="60" ry="25" fill="#FFA500"/>
            </g>
        </svg>`
    },
    {
        id: 'figma',
        name: 'Figma',
        category: 'Databases and DevOps Tools',
        color: '#F24E1E',
        svg: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="#161b22"/>
            <g transform="translate(166, 96) scale(0.65)">
                <path d="M90 0h90v90H90a45 45 0 0 1-45-45A45 45 0 0 1 90 0z" fill="#F24E1E"/>
                <path d="M180 0h90a45 45 0 0 1 45 45 45 45 0 0 1-45 45h-90V0z" fill="#FF7262"/>
                <path d="M90 90h90v90H90a45 45 0 0 1-45-45 45 45 0 0 1 45-45z" fill="#A259FF"/>
                <circle cx="225" cy="135" r="45" fill="#1ABCFE"/>
                <path d="M90 180h90v90a45 45 0 0 1-45 45 45 45 0 0 1-45-45v-90z" fill="#0ACF83"/>
            </g>
        </svg>`
    }
];

async function generate() {
    console.log(`Generating ${icons.length} tech icons...`);
    for (const icon of icons) {
        const filePath = path.join(outDir, `${icon.id}.png`);
        await sharp(Buffer.from(icon.svg))
            .resize(512, 512)
            .png({ quality: 95 })
            .toFile(filePath);
        console.log(`Generated: ${filePath}`);
    }
    // Also save metadata JSON for easy loading in 3D
    fs.writeFileSync('static/tech-arsenal/tech-data.json', JSON.stringify(icons, null, 2));
    console.log('Saved tech-data.json');
}

generate().catch(err => {
    console.error(err);
    process.exit(1);
});
