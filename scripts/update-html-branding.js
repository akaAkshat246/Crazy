import fs from 'fs'

let html = fs.readFileSync('sources/index.html', 'utf8')

// Replace Three.js journey / devlogs section with Akshat's learning & experiences
const targetStart = '<h2 class="title">Learning 3D Web</h2>'
const targetEnd = '<h2 class="title">Source code</h2>'

const startIndex = html.indexOf(targetStart)
const endIndex = html.indexOf(targetEnd)

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `<h2 class="title">Learning 3D Web</h2>
                                <p class="text">
                                    Inspired by creative web engineering and <a href="https://threejs-journey.com" target="_blank" rel="noreferrer">Three.js Journey</a>.
                                    <br />Continuously experimenting with real-time 3D environments, shaders, and physics simulations on the web.
                                </p>
                                
                                <h2 class="title">Interactive Experiences</h2>
                                <p class="text">
                                    Crafted by <strong>Akshat Vats</strong> with high-performance WebGL & WebGPU rendering, responsive physics, and cross-device interaction.
                                </p>
                                
                                `
    html = html.substring(0, startIndex) + replacement + html.substring(endIndex)
}

html = html.replace(/— Akshat\r?\n/g, '— Akshat Vats\n')
html = html.replace(/src="ui\/flags\/fr\.webp"/g, 'src="ui/flags/in.webp"')

fs.writeFileSync('sources/index.html', html, 'utf8')
console.log('Successfully updated sources/index.html!')

