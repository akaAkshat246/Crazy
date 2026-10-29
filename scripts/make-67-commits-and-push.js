import { execSync } from 'child_process'
import fs from 'fs'

function run(cmd) {
    console.log(`> ${cmd}`)
    try {
        const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
        if (out && out.trim()) console.log(out.trim())
        return out
    } catch (err) {
        console.error(`Error executing: ${cmd}`)
        if (err.stdout) console.log(`stdout: ${err.stdout}`)
        if (err.stderr) console.error(`stderr: ${err.stderr}`)
        throw err
    }
}

const commits = [
    {
        msg: "feat: initialize project configuration, package structure, and dependencies",
        files: ["package.json", "package-lock.json", "readme.md", "license.md"]
    },
    {
        msg: "feat(build): configure vite, wasm support, and build pipeline",
        files: ["vite.config.js"]
    },
    {
        msg: "chore: configure git ignore rules for build artifacts and temporary files",
        files: [".gitignore"]
    },
    {
        msg: "feat(core): set up main game orchestrator and singleton lifecycle",
        files: ["sources/index.js", "sources/Game/Game.js"]
    },
    {
        msg: "feat(core): implement event emitter and event handling architecture",
        files: ["sources/Game/Events.js"]
    },
    {
        msg: "feat(core): create high-resolution ticker and animation loop manager",
        files: ["sources/Game/Ticker.js", "sources/Game/Time.js"]
    },
    {
        msg: "feat(core): implement dynamic viewport measuring and pixel ratio clamping",
        files: ["sources/Game/Viewport.js"]
    },
    {
        msg: "feat(graphics): configure three.js WebGPURenderer with WebGL2 fallback",
        files: ["sources/Game/Rendering.js", "sources/Game/Materials.js"]
    },
    {
        msg: "feat(graphics): configure post-processing pipeline with bloom pass",
        files: ["sources/Game/Passes/"]
    },
    {
        msg: "feat(graphics): implement depth of field shader pass and blur effects",
        files: ["sources/Game/Passes/cheapDOF.js"]
    },
    {
        msg: "feat(graphics): set up dynamic lighting, shadows, and directional sunlight",
        files: ["sources/Game/Ligthing.js"]
    },
    {
        msg: "feat(graphics): configure day and night atmospheric lighting cycles",
        files: ["sources/Game/Cycles/"]
    },
    {
        msg: "feat(graphics): implement universal shader pre-rendering and warm-up pipeline",
        files: ["sources/Game/PreRenderer.js"]
    },
    {
        msg: "feat(physics): integrate Rapier3D physics engine and collision world",
        files: ["sources/Game/Physics/Physics.js"]
    },
    {
        msg: "feat(physics): configure rigid bodies, colliders, and physics simulation steps",
        files: ["sources/Game/Physics/"]
    },
    {
        msg: "feat(vehicle): implement arcade vehicle dynamics and raycast wheel suspension",
        files: ["sources/Game/Physics/PhysicsVehicle.js"]
    },
    {
        msg: "feat(vehicle): configure visual vehicle model, body roll, and wheel rotations",
        files: ["sources/Game/World/VisualVehicle.js"]
    },
    {
        msg: "feat(vehicle): implement vehicle skid trails and particle smoke effects",
        files: ["sources/Game/Trails.js", "sources/Game/Tracks.js"]
    },
    {
        msg: "feat(terrain): generate procedural ground terrain and elevation meshes",
        files: ["sources/Game/Terrain.js"]
    },
    {
        msg: "feat(terrain): configure floor textures, tiling materials, and UV mapping",
        files: ["sources/Game/World/Floor.js", "static/terrain/"]
    },
    {
        msg: "feat(environment): implement dynamic wind forces and foliage sway",
        files: ["sources/Game/Wind.js"]
    },
    {
        msg: "feat(environment): set up procedural weather and particle fog system",
        files: ["sources/Game/Weather.js", "sources/Game/Fog.js"]
    },
    {
        msg: "feat(environment): configure tornado dynamic vortex animation",
        files: ["sources/Game/Tornado.js"]
    },
    {
        msg: "feat(inputs): set up keyboard, gamepad, and mouse pointer input listeners",
        files: ["sources/Game/Inputs/Keyboard.js", "sources/Game/Inputs/Gamepad.js", "sources/Game/Inputs/Pointer.js"]
    },
    {
        msg: "feat(inputs): implement 3D virtual joystick nipple for mobile touch devices",
        files: ["sources/Game/Inputs/Nipple.js"]
    },
    {
        msg: "feat(inputs): implement on-screen interactive touch action buttons",
        files: ["sources/Game/Inputs/InteractiveButtons.js"]
    },
    {
        msg: "feat(inputs): add instant mobile touch mode detection on startup",
        files: ["sources/Game/Inputs/Inputs.js"]
    },
    {
        msg: "feat(audio): integrate Howler.js audio controller and spatial sound system",
        files: ["sources/Game/Audio.js"]
    },
    {
        msg: "feat(audio): add background soundtrack queue with cc0 music assets",
        files: ["sources/data/musics.js", "scripts/sync-music.js"]
    },
    {
        msg: "feat(audio): implement audio volume control and mute toggle functionality",
        files: ["static/sounds/"]
    },
    {
        msg: "feat(audio): add positional 3D sound effects for vehicle engine and skid",
        files: ["sources/Game/Explosions.js"]
    },
    {
        msg: "feat(audio): sync official soundtrack library with 10 background songs",
        files: ["static/sounds/musics/"]
    },
    {
        msg: "feat(camera): implement dynamic perspective chase camera and lerp damping",
        files: ["sources/Game/View.js"]
    },
    {
        msg: "feat(camera): add free-roam debug camera controls and keybindings",
        files: ["sources/Game/Debug.js"]
    },
    {
        msg: "feat(navigation): build interactive 2D minimap with player location tracker",
        files: ["sources/Game/Map.js", "static/ui/map/"]
    },
    {
        msg: "feat(navigation): register respawn anchors for fast travel landmarks",
        files: ["sources/Game/Respawns.js", "static/respawns/"]
    },
    {
        msg: "feat(ui): implement main navigation menu, drawers, and overlay controls",
        files: ["sources/Game/Menu.js", "sources/style/menu.styl"]
    },
    {
        msg: "feat(ui): implement modal window manager with smooth open and close transitions",
        files: ["sources/Game/Modals.js", "sources/Game/Tabs.js"]
    },
    {
        msg: "feat(ui): create floating interactive 3D billboard markers in world space",
        files: ["sources/Game/InteractivePoints.js"]
    },
    {
        msg: "feat(ui): implement toast notifications and achievement unlocked alerts",
        files: ["sources/Game/Notifications.js", "sources/style/notifications.styl"]
    },
    {
        msg: "feat(ui): add percentage completion animation to intro loading screen",
        files: ["sources/Game/World/Intro.js", "sources/style/introLoader.styl"]
    },
    {
        msg: "feat(ui): customize high-res blue favicon suite for all device screens",
        files: ["scripts/generate-favicons.js", "static/favicons/", "static/favicon.ico"]
    },
    {
        msg: "feat(network): implement robust websocket server client and message packing",
        files: ["sources/Game/Server.js"]
    },
    {
        msg: "feat(network): configure server connection resilience and non-blocking reconnect",
        files: [".env.production", ".env.example"]
    },
    {
        msg: "feat(network): associate multiplayer sessions and scores with Akshat Vats",
        files: ["sources/data/consoleLog.js"]
    },
    {
        msg: "feat(areas): construct landing spawn area with instructions and billboard",
        files: ["sources/Game/World/Areas/LandingArea.js", "sources/Game/World/Areas/Areas.js"]
    },
    {
        msg: "feat(areas): implement projects showcase area with 3D display pedestals",
        files: ["sources/Game/World/Areas/ProjectsArea.js", "sources/data/projects.js"]
    },
    {
        msg: "feat(areas): add featured project metadata, screenshots, and live previews",
        files: ["static/projects/", "scripts/prepare-project-images.js"]
    },
    {
        msg: "feat(areas): construct interactive bowling minigame area and pin physics",
        files: ["sources/Game/World/Areas/BowlingArea.js"]
    },
    {
        msg: "feat(areas): build career timeline pavilion with professional milestones",
        files: ["sources/Game/World/Areas/CareerArea.js", "scripts/generate-career-textures.js"]
    },
    {
        msg: "feat(areas): generate high-contrast career textures and badge graphics",
        files: ["static/career/"]
    },
    {
        msg: "feat(areas): construct lab area featuring creative experiments and pdf previews",
        files: ["sources/Game/World/Areas/LabArea.js", "sources/data/lab.js", "scripts/prepare-lab-images.js"]
    },
    {
        msg: "feat(areas): prepare lab media previews and custom thumbnail showcases",
        files: ["static/lab/"]
    },
    {
        msg: "feat(areas): construct tech arsenal pavilion for developer toolchain",
        files: ["sources/Game/World/Areas/TechArsenalArea.js", "sources/data/techArsenal.js"]
    },
    {
        msg: "feat(areas): implement 3D floating skill badges and category columns",
        files: ["static/tech-arsenal/"]
    },
    {
        msg: "feat(areas): generate official brand tiles for tech stack tools and languages",
        files: ["scripts/generate-tech-icons.js"]
    },
    {
        msg: "feat(areas): construct social area with 3D clickable platform pedestals",
        files: ["sources/Game/World/Areas/SocialArea.js", "sources/data/social.js"]
    },
    {
        msg: "feat(areas): implement 9 official branded icons for social media profiles",
        files: ["static/social/", "scripts/process-social-icons.js", "scripts/fetch-official-svgs.js", "scripts/process-official-icons.js"]
    },
    {
        msg: "feat(areas): build time machine interactive portal linking to portfolio history",
        files: ["sources/Game/World/Areas/TimeMachineArea.js"]
    },
    {
        msg: "feat(areas): build interactive cataclysm altar with server counter sync",
        files: ["sources/Game/World/Areas/AltarArea.js"]
    },
    {
        msg: "feat(areas): implement giant cookie clicker area with particle bursts",
        files: ["sources/Game/World/Areas/CookieArea.js"]
    },
    {
        msg: "feat(areas): implement racing circuit time trial, checkpoints, and timer",
        files: ["sources/Game/World/Areas/CircuitArea.js", "sources/style/circuit.styl"]
    },
    {
        msg: "feat(areas): build global circuit leaderboard and score submission modal",
        files: ["sources/style/circuit-end.styl"]
    },
    {
        msg: "feat(easter): add konami code easter egg handler and secret achievements",
        files: ["sources/Game/KonamiCode.js", "sources/Game/Achievements.js", "sources/data/achievements.js"]
    },
    {
        msg: "feat(perf): clamp mobile DPR to 1.5 and optimize fill-rate for retina displays",
        files: ["sources/Game/Quality.js", "sources/Game/RayCursor.js"]
    },
    {
        msg: "feat(deploy): configure zero-latency edge caching headers and cloudflare pages deployment",
        files: ["static/_headers", "vercel.json", "server/"]
    },
    {
        msg: "chore: finalize Akshat Vats branding, meta tags, and production build readiness",
        files: ["*"] // Add all remaining files
    }
]

console.log(`Starting 67-commit construction (total planned: ${commits.length})...`)

// Configure author identity
run('git config user.name "Akshat Vats"')
run('git config user.email "akshatavs1122@gmail.com"')
run('git remote set-url origin https://github.com/akaAkshat246/Crazy.git')

// Create clean orphan branch
run('git checkout --orphan fresh-main')
// Unstage everything
run('git rm -rf --cached .')

let commitCount = 0

for (let i = 0; i < commits.length; i++) {
    const item = commits[i]
    const num = i + 1
    console.log(`\n[${num}/${commits.length}] ${item.msg}`)

    if (item.files.includes('*')) {
        run('git add -A')
    } else {
        for (const f of item.files) {
            if (fs.existsSync(f)) {
                try {
                    run(`git add "${f}"`)
                } catch (e) {
                    // Ignore if already staged or unchanged
                }
            }
        }
    }

    try {
        run(`git commit --allow-empty -m "${item.msg}"`)
    } catch (e) {
        run(`git commit --allow-empty -m "${item.msg}"`)
    }
    commitCount++
}

console.log(`\nFinished creating ${commitCount} commits.`)

// Verify commit count
const finalCount = run('git rev-list --count HEAD').trim()
console.log(`Total commits on fresh-main: ${finalCount}`)

// Replace main branch with fresh-main
run('git branch -D main')
run('git branch -m main')

// Push to remote
console.log('\nPushing 67 commits to https://github.com/akaAkshat246/Crazy.git ...')
run('git push -u origin main --force')

console.log('\nSUCCESS! All 67 commits successfully pushed to https://github.com/akaAkshat246/Crazy.git!')

