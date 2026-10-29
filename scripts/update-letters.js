import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

async function updateLetters(glbPath) {
    console.log('Processing:', glbPath);
    const backupPath = glbPath + '.orig';
    if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, glbPath);
        console.log('Restored from original backup:', backupPath);
    } else {
        fs.copyFileSync(glbPath, backupPath);
        console.log('Created backup:', backupPath);
    }

    const fontData = JSON.parse(fs.readFileSync('static/fonts/helvetiker_bold.typeface.json', 'utf8'));
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(fontData);

    const io = new NodeIO();
    const doc = await io.read(glbPath);
    const root = doc.getRoot();

    // 10 letters: AKSHAT (6) + VATS (4)
    // 019 = A, 018 = K, 017 = S, 016 = H, 015 = A, 014 = T
    // 013 = V, 012 = A, 011 = T, 010 = S
    const letterConfigs = [
        { nodeIndex: 19, char: 'A' },
        { nodeIndex: 18, char: 'K' },
        { nodeIndex: 17, char: 'S' },
        { nodeIndex: 16, char: 'H' },
        { nodeIndex: 15, char: 'A' },
        { nodeIndex: 14, char: 'T' },
        { nodeIndex: 13, char: 'V' },
        { nodeIndex: 12, char: 'A' },
        { nodeIndex: 11, char: 'T' },
        { nodeIndex: 10, char: 'S' }
    ];

    const startX = -10.869;
    const startZ = 5.725;
    const endX = 0.448;
    const endZ = 0.447;
    const posY = -2.528;

    const slots = [
        0,    // A
        1,    // K
        2,    // S
        3,    // H
        4,    // A
        5,    // T
        6.7,  // V (extra spacing for word gap)
        7.7,  // A
        8.7,  // T
        9.7   // S
    ];
    const maxSlot = 9.7;

    for (let i = 0; i < letterConfigs.length; i++) {
        const config = letterConfigs[i];
        const nodeName = 'refLettersPhysicalDynamic.0' + config.nodeIndex;
        const node = root.listNodes().find(n => n.getName() === nodeName);
        if (!node) {
            console.error('Node not found:', nodeName);
            continue;
        }

        // Calculate new position
        const t = slots[i] / maxSlot;
        const newX = startX + (endX - startX) * t;
        const newZ = startZ + (endZ - startZ) * t;
        node.setTranslation([newX, posY, newZ]);

        // Generate TextGeometry
        let geom = new TextGeometry(config.char, {
            font: font,
            size: 1.45,
            depth: 0.46,
            curveSegments: 3,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.03
        });
        geom.computeBoundingBox();
        geom.center();
        geom.computeVertexNormals();

        // Index the geometry using mergeVertices!
        geom = mergeVertices(geom);

        const posAttr = geom.getAttribute('position');
        const normAttr = geom.getAttribute('normal');
        const indexAttr = geom.getIndex();

        const vertexCount = posAttr.count;
        const positions = new Float32Array(posAttr.array);
        const normals = new Float32Array(normAttr.array);
        const uvs = new Float32Array(vertexCount * 2);
        for (let j = 0; j < vertexCount; j++) {
            uvs[j * 2 + 0] = 0.7356298;
            uvs[j * 2 + 1] = 0.5;
        }

        const indices = new Uint32Array(indexAttr.array);

        // Update glTF mesh
        const mesh = node.getMesh();
        const prim = mesh.listPrimitives()[0];

        // Accessors
        const posAccessor = doc.createAccessor()
            .setType('VEC3')
            .setArray(positions);
        const normAccessor = doc.createAccessor()
            .setType('VEC3')
            .setArray(normals);
        const uvAccessor = doc.createAccessor()
            .setType('VEC2')
            .setArray(uvs);
        const indexAccessor = doc.createAccessor()
            .setType('SCALAR')
            .setArray(indices);

        prim.setAttribute('POSITION', posAccessor);
        prim.setAttribute('NORMAL', normAccessor);
        prim.setAttribute('TEXCOORD_0', uvAccessor);
        prim.setIndices(indexAccessor);

        // Update cuboid collider child scale
        const cuboidChild = node.listChildren().find(c => c.getName().startsWith('cuboid'));
        if (cuboidChild) {
            const min = geom.boundingBox.min;
            const max = geom.boundingBox.max;
            const width = max.x - min.x;
            const height = max.y - min.y;
            const depth = max.z - min.z;
            cuboidChild.setScale([width, height, depth]);
        }

        console.log(`Updated letter ${config.char} with indexed mesh (vertices: ${vertexCount}, indices: ${indices.length}) at pos: [${newX.toFixed(2)}, ${posY}, ${newZ.toFixed(2)}]`);
    }

    await io.write(glbPath, doc);
    console.log('Successfully wrote:', glbPath);
}

async function main() {
    await updateLetters('static/areas/areas.glb');
    fs.copyFileSync('static/areas/areas.glb', 'static/areas/areas-compressed.glb');
    console.log('Copied to static/areas/areas-compressed.glb');
}

main().catch(console.error);
