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
            { text: 'AKSHAT VATS', size: 17 },
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
            { text: '10TH GRADE', size: 15 },
            { text: '95.6% (2023)', size: 14 }
        ]
    },
    {
        name: 'careerIRLTeacher',
        width: 268,
        height: 92,
        lines: [
            { text: 'GOVERNOR AWARDEE', size: 15 },
            { text: 'YEAR 2025', size: 15 },
            { text: 'SPECIAL HONOREE', size: 14.5 }
        ]
    },
    {
        name: 'careerImmersiveGarden',
        width: 340,
        height: 60,
        lines: [
            { text: 'CLASS 12TH (2025)', size: 17 },
            { text: '90% SCORE', size: 17 }
        ]
    },
    {
        name: 'careerOnlineTeacher',
        width: 332,
        height: 92,
        lines: [
            { text: 'PURSUING B.TECH', size: 16.5 },
            { text: 'COMPUTER SCIENCE', size: 16 },
            { text: '2025 TILL NOW', size: 16.5 }
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

        await sharp(Buffer.from(svg))
            .png()
            .toFile(outPath);

        console.log(`Generated ${m.name}.png (${m.width}x${m.height})`);
    }
}

generate();
