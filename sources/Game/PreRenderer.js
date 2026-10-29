import * as THREE from 'three/webgpu'
import { Game } from './Game.js'
import CubeRenderTarget from 'three/src/renderers/common/CubeRenderTarget.js'

export class PreRenderer
{
    static render()
    {
        const game = Game.getInstance()

        if(!game || !game.rendering || !game.rendering.renderer)
            return

        // Setup 360-degree cube camera
        const renderTarget = new CubeRenderTarget(32)
        const cubeCamera = new THREE.CubeCamera(0.1, 100000, renderTarget)
        game.scene.add(cubeCamera)

        // Make all meshes temporarily visible so all material shaders compile
        const invisibles = []
        game.scene.traverse((child) =>
        {
            if(child.visible === false && typeof child.userData.preventPreRender === 'undefined')
            {
                child.visible = true
                invisibles.push(child)
            }
        })

        try
        {
            // 1. Force compilation of 3D meshes & materials across all view angles
            cubeCamera.update(game.rendering.renderer, game.scene)

            // 2. Warm up primary camera and post-processing pipeline
            if(game.rendering.postProcessing)
            {
                game.rendering.postProcessing.render()
            }
        }
        catch(e)
        {
            // Fallback gracefully without breaking load sequence
        }

        // Restore original object visibility
        for(const child of invisibles)
            child.visible = false

        // Free resources to prevent memory leaks
        game.scene.remove(cubeCamera)
        renderTarget.dispose()
    }
}
