async function testAllResources() {
    const baseUrl = 'https://33df8989.akshat-vats-portfolio.pages.dev/'
    const files = [
        'respawns/respawnsReferences-compressed.glb',
        'behindTheScene/stars.ktx',
        'intro/sound.ktx',
        'palette.ktx',
        'foliage/foliageSDF.ktx',
        'bushes/bushesReferences-compressed.glb',
        'vehicle/default-compressed.glb',
        'playground/playgroundVisual-compressed.glb',
        'playground/playgroundPhysical-compressed.glb',
        'flowers/flowersReferences-compressed.glb',
        'bricks/bricks-compressed.glb',
        'fences/fences-compressed.glb',
        'benches/benches-compressed.glb',
        'explosiveCrates/explosiveCrates-compressed.glb',
        'lanterns/lanterns-compressed.glb',
        'terrain/terrain.ktx',
        'terrain/terrain-compressed.glb',
        'floor/slabs.ktx',
        'birchTrees/birchTreesVisual-compressed.glb',
        'birchTrees/birchTreesReferences-compressed.glb',
        'oakTrees/oakTreesVisual-compressed.glb',
        'oakTrees/oakTreesReferences-compressed.glb',
        'cherryTrees/cherryTreesVisual-compressed.glb',
        'cherryTrees/cherryTreesReferences-compressed.glb',
        'scenery/scenery-compressed.glb',
        'areas/areas-compressed.glb',
        'poleLights/poleLights-compressed.glb',
        'whispers/whisperFlame.ktx',
        'areas/satanStar.ktx',
        'tornado/tornadoPathReferences-compressed.glb',
        'overlay/overlayPattern.ktx',
        'interactivePoints/interactivePointsKeyIconCross.ktx',
        'interactivePoints/interactivePointsKeyIconEnter.ktx',
        'interactivePoints/interactivePointsKeyIconA.ktx',
        'jukebox/jukeboxMusicNotes.ktx',
        'achievements/glyphs.ktx',
        'career/careerFreelancer.png',
        'career/careerHetic.png',
        'career/careerImmersiveGarden.png',
        'career/careerIRLTeacher.png',
        'career/careerOnlineTeacher.png',
        'career/careerUzik.png',
        'timeMachine/timeMachineScreenMGS.ktx',
        'timeMachine/timeMachineScreenFolio.ktx'
    ]

    console.log(`Testing ${files.length} game resources against ${baseUrl}...`)
    let failed = 0
    let totalBytes = 0
    const startAll = Date.now()

    for (const f of files) {
        const u = baseUrl + f
        const t0 = Date.now()
        try {
            const res = await fetch(u)
            const ms = Date.now() - t0
            if (!res.ok) {
                console.error(`FAIL [${res.status}]: ${f}`)
                failed++
            } else {
                const buf = await res.arrayBuffer()
                totalBytes += buf.byteLength
                console.log(`OK (${ms}ms, ${(buf.byteLength / 1024).toFixed(1)} KB): ${f}`)
            }
        } catch (e) {
            console.error(`ERR: ${f}`, e.message)
            failed++
        }
    }

    console.log(`\nFinished in ${Date.now() - startAll}ms. Total downloaded: ${(totalBytes / 1024 / 1024).toFixed(2)} MB. Failed: ${failed}`)
}

testAllResources()

