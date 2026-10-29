import 'dotenv/config'
import restart from 'vite-plugin-restart'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default {
    root: 'sources/', // Sources files (typically where index.html is)
    envDir: '../',  // Directory where the env file is located
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: './', // Public path (what's after the domain)
    server:
    {
        // https: true,
        host: false, // Only listen on localhost
        open: true // Open in browser
    },
    optimizeDeps:
    {
        include:
        [
            'three',
            'three/webgpu',
            'three/tsl',
            'three/addons/loaders/GLTFLoader.js',
            'three/addons/loaders/DRACOLoader.js',
            'three/addons/loaders/KTX2Loader.js',
            'gsap',
            'howler',
            '@dimforge/rapier3d'
        ]
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false // Add sourcemap
    },
    plugins:
    [
        wasm(),
        topLevelAwait(),
        restart({ restart: [ '../sources/data/**', '../.env' ] }),
        nodePolyfills(),
        // basicSsl()
    ]
}
