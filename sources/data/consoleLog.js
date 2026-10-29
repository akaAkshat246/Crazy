import * as THREE from 'three/webgpu'

const text = `
 █████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ ████████╗    ██╗   ██╗ █████╗ ████████╗███████╗
██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗╚══██╔══╝    ██║   ██║██╔══██╗╚══██╔══╝██╔════╝
███████║█████╔╝ ███████╗███████║███████║   ██║       ██║   ██║███████║   ██║   ███████╗
██╔══██║██╔═██╗ ╚════██║██╔══██║██╔══██║   ██║       ╚██╗ ██╔╝██╔══██║   ██║   ╚════██║
██║  ██║██║  ██╗███████║██║  ██║██║  ██║   ██║        ╚████╔╝ ██║  ██║   ██║   ███████║
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝         ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝

╔═ Intro ═══════════════╗
║ Thank you for visiting my portfolio, you sneaky developer!
║ Welcome to Akshat Vats's interactive 3D portfolio.
╚═══════════════════════╝

╔═ Socials ═══════════════╗
║ Mail          ⇒ akshatavs1122@gmail.com
║ GitHub        ⇒ https://github.com/akaAkshat246
║ LinkedIn      ⇒ https://www.linkedin.com/in/akshat-vats-b6b1692b6/
║ Instagram     ⇒ https://www.instagram.com/who_akshatvats?obrf=MWN1N3p3c3FiMmlpMA==
║ LeetCode      ⇒ https://leetcode.com/u/Akshat_avs/
║ CodeChef      ⇒ https://www.codechef.com/users/akshat_vats963
║ HackerRank    ⇒ https://www.hackerrank.com/profile/akshat_25b010103
║ GeeksforGeeks ⇒ https://www.geeksforgeeks.org/profile/akshatadz0l
║ Codolio       ⇒ https://codolio.com/profile/akaAkshat246
╚═══════════════════════╝

╔═ Featured Projects ═════╗
║ Brawnsterdam    ⇒ https://brawnsterdam.akshatavs1122.workers.dev/
║ ABES Nexus      ⇒ https://abes-nexus.onrender.com
║ Debug Assistant ⇒ https://debug-assistant-5g7p.onrender.com
║ Aarogya Grid AI ⇒ https://aarogya-grid-ai-alpha.vercel.app/
║ WaterMap        ⇒ https://watermap-frontend-120030173066.us-central1.run.app
║ Ha-X Baby       ⇒ https://ha-x-baby-ten.vercel.app/
║ Janamashtami    ⇒ https://janamashtamii.netlify.app
║ My Project      ⇒ https://akaakshat246.github.io/my-project/
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ You can access the debug mode by adding #debug at the end of the URL and reloading.
║ Press [V] to toggle the free camera.
╚═══════════════════════╝

╔═ Three.js ════════════╗
║ Three.js is the library I’m using to render this 3D world (release: ${THREE.REVISION})
║ https://threejs.org/
║ Powered by WebGL and WebGPU with TSL shading.
╚═══════════════════════╝

╔═ Musics ══════════════╗
║ Original soundtrack by Kounine (Linktree: https://linktr.ee/Kounine).
║ Released under CC0 license.
╚═══════════════════════╝

╔═ Some more links ═════╗
║ Rapier (Physics library)  ⇒ https://rapier.rs/
║ Howler.js (Audio library) ⇒ https://howlerjs.com/
║ Amatic SC (Fonts)         ⇒ https://fonts.google.com/specimen/Amatic+SC
║ Nunito (Fonts)            ⇒ https://fonts.google.com/specimen/Nunito?query=Nunito
╚═══════════════════════╝
`

export default [
    text
]