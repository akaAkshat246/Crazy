import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const fontData = JSON.parse(fs.readFileSync('static/fonts/helvetiker_bold.typeface.json', 'utf8'));
const font = new FontLoader().parse(fontData);

function textToSvgPaths(text, size, offsetX = 0, offsetY = 0) {
    const shapes = font.generateShapes(text, size);
    let d = '';

    function addCurvePath(curves) {
        if (!curves || curves.length === 0) return;
        const p0 = curves[0].v1 || curves[0].getPoint(0);
        d += `M ${(p0.x + offsetX).toFixed(2)} ${(-p0.y + offsetY).toFixed(2)} `;
        for (const curve of curves) {
            if (curve.isLineCurve) {
                d += `L ${(curve.v2.x + offsetX).toFixed(2)} ${(-curve.v2.y + offsetY).toFixed(2)} `;
            } else if (curve.isQuadraticBezierCurve) {
                d += `Q ${(curve.v1.x + offsetX).toFixed(2)} ${(-curve.v1.y + offsetY).toFixed(2)} ${(curve.v2.x + offsetX).toFixed(2)} ${(-curve.v2.y + offsetY).toFixed(2)} `;
            } else if (curve.isCubicBezierCurve) {
                d += `C ${(curve.v1.x + offsetX).toFixed(2)} ${(-curve.v1.y + offsetY).toFixed(2)} ${(curve.v2.x + offsetX).toFixed(2)} ${(-curve.v2.y + offsetY).toFixed(2)} ${(curve.v3.x + offsetX).toFixed(2)} ${(-curve.v3.y + offsetY).toFixed(2)} `;
            } else {
                const pts = curve.getPoints(8);
                for (let i = 1; i < pts.length; i++) {
                    d += `L ${(pts[i].x + offsetX).toFixed(2)} ${(-pts[i].y + offsetY).toFixed(2)} `;
                }
            }
        }
        d += 'Z ';
    }

    for (const shape of shapes) {
        addCurvePath(shape.curves);
        if (shape.holes) {
            for (const hole of shape.holes) {
                addCurvePath(hole.curves);
            }
        }
    }

    // Compute bounding box
    let minX = Infinity, maxX = -Infinity;
    for (const s of shapes) {
        for (const c of s.curves) {
            const p = c.v2 || c.getPoint(1);
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
        }
    }
    const width = maxX > minX ? maxX - minX : 0;

    return { pathData: d, width };
}

const milestones = [
    {
        name: 'careerHetic',
        width: 316,
        height: 60,
        lines: [
            { text: 'THE JOURNEY BEGINS', size: 16.5 },
            { text: 'BORN IN 2006', size: 17 }
        ]
    },
    {
        name: 'careerFreelancer',
        width: 240,
        height: 60,
        lines: [
            { text: 'TECH ENTHUSIAST', size: 15 },
            { text: 'CREATIVE DEVELOPER', size: 13.5 }
        ]
    },
    {
        name: 'careerUzik',
        width: 168,
        height: 60,
        lines: [
            { text: '10TH GRADE', size: 15.5 },
            { text: '95.6% SCORE', size: 15.5 }
        ]
    },
    {
        name: 'careerIRLTeacher',
        width: 268,
        height: 92,
        lines: [
            { text: 'GOVERNOR AWARD', size: 15.5 },
            { text: 'UTTAR PRADESH', size: 15.5 },
            { text: 'GOVT. HONOREE', size: 15.5 }
        ]
    },
    {
        name: 'careerImmersiveGarden',
        width: 340,
        height: 60,
        lines: [
            { text: '12TH GRADE (2025)', size: 17 },
            { text: '90% SCORE', size: 17 }
        ]
    },
    {
        name: 'careerOnlineTeacher',
        width: 332,
        height: 92,
        lines: [
            { text: 'PURSUING B.TECH', size: 16.5 },
            { text: 'CSE BRANCH', size: 16.5 },
            { text: '2025 - PRESENT', size: 16.5 }
        ]
    }
];

async function generate() {
    const lineH = 27;
    const gap = 5;
    const paddingX = 4;
    const paddingRight = 8;

    for (const m of milestones) {
        let rects = '';
        let paths = '';

        m.lines.forEach((l, idx) => {
            const y = idx * (lineH + gap);
            // Three.js FontLoader baseline offset
            const offsetY = y + 20;
            const offsetX = paddingX;

            const { pathData, width } = textToSvgPaths(l.text, l.size, offsetX, offsetY);
            const boxWidth = Math.min(m.width, Math.ceil(width + paddingX + paddingRight));

            rects += `<rect x="0" y="${y}" width="${boxWidth}" height="${lineH}" rx="1" fill="#00FF00" />\n`;
            paths += `<path d="${pathData}" fill="#FF0000" fill-rule="evenodd" />\n`;
        });

        const svg = `
<svg width="${m.width}" height="${m.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#000000" />
  ${rects}
  ${paths}
</svg>
`;

        const outPath = path.join('static', 'career', `${m.name}.png`);
        
        // Backup original if not yet backed up
        const backupPath = path.join('static', 'career', `${m.name}.orig.png`);
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(outPath, backupPath);
        }

        await sharp(Buffer.from(svg))
            .png()
            .toFile(outPath);

        console.log(`Generated ${m.name}.png (${m.width}x${m.height})`);

        // Generate a preview simulating the exact in-game shader
        const img = sharp(outPath);
        const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
        const outData = Buffer.alloc(info.width * info.height * 3);
        for (let i = 0, j = 0; i < data.length; i += info.channels, j += 3) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            
            // Mask color #251f2b: [37, 31, 43]
            // Glowing text: [255, 230, 200]
            const isVisible = Math.max(r, g) >= 0.1;
            if (isVisible) {
                outData[j] = Math.round(37 * (1 - r) + 255 * r);
                outData[j + 1] = Math.round(31 * (1 - r) + 245 * r);
                outData[j + 2] = Math.round(43 * (1 - r) + 235 * r);
            } else {
                // Background dark void
                outData[j] = 18;
                outData[j + 1] = 16;
                outData[j + 2] = 22;
            }
        }
        await sharp(outData, { raw: { width: info.width, height: info.height, channels: 3 } })
            .png()
            .toFile(path.join('static', 'career', `${m.name}-preview.png`));
    }
}

generate();
