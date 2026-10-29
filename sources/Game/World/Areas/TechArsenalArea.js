import * as THREE from 'three/webgpu'
import { Game } from '../../Game.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { TextCanvas } from '../../TextCanvas.js'
import techData from '../../../data/techArsenal.js'

export class TechArsenalArea
{
    constructor()
    {
        this.game = Game.getInstance()
        this.group = new THREE.Group()
        this.group.position.set(5.5, 0, 20.5)
        this.group.rotation.y = 0.68
        this.game.scene.add(this.group)

        this.textureLoader = new THREE.TextureLoader()
        this.floatingBlocks = []
        this.techData = techData

        this.init()
    }

    init()
    {
        this.setCourt()
        this.setBlocks()
        this.setCategorySigns()
        this.setMainSign()
        this.setInteractivePoint()

        // Ticker for smooth floating animations
        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 11)
    }

    setCourt()
    {
        // Circular decorative paved plaza base under the tech arsenal
        const courtGeom = new THREE.CylinderGeometry(8.5, 9.0, 0.16, 36)
        const courtMat = new THREE.MeshLambertNodeMaterial({
            color: '#342f3d'
        })
        const courtMesh = new THREE.Mesh(courtGeom, courtMat)
        courtMesh.position.set(0, 0.08, 0)
        courtMesh.receiveShadow = true
        this.group.add(courtMesh)

        // Outer glow ring
        const ringGeom = new THREE.RingGeometry(8.3, 8.7, 48)
        ringGeom.rotateX(-Math.PI * 0.5)
        const ringMat = new THREE.MeshBasicNodeMaterial({
            color: '#ff90bf',
            side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeom, ringMat)
        ringMesh.position.set(0, 0.17, 0)
        this.group.add(ringMesh)
    }

    setBlocks()
    {
        // 4 categories in tiered stadium rows from back (z < 0) to front (z > 0)
        const categories = [
            { name: 'Languages and Core', z: -4.5, y: 1.5 },
            { name: 'Frontend Engineering', z: -1.5, y: 1.1 },
            { name: 'Backend, Cloud and Edge', z: 1.5, y: 0.7 },
            { name: 'Databases and DevOps Tools', z: 4.5, y: 0.3 }
        ]

        let globalIndex = 0

        categories.forEach(cat =>
        {
            const items = this.techData.filter(t => t.category === cat.name)
            const count = items.length
            const spacing = 1.35
            const startX = - ((count - 1) * spacing) / 2

            items.forEach((item, idx) =>
            {
                const localX = startX + idx * spacing
                const localZ = cat.z
                const baseY = cat.y

                // 1. Pedestal stand
                const pedestalHeight = baseY + 0.35
                const pedestalGeom = new THREE.CylinderGeometry(0.38, 0.44, pedestalHeight, 16)
                const pedestalMat = new THREE.MeshLambertNodeMaterial({
                    color: '#23202b'
                })
                const pedestalMesh = new THREE.Mesh(pedestalGeom, pedestalMat)
                pedestalMesh.position.set(localX, pedestalHeight * 0.5, localZ)
                pedestalMesh.castShadow = true
                pedestalMesh.receiveShadow = true
                this.group.add(pedestalMesh)

                // Add physical collider at world coordinates so car can bump / navigate
                const worldPos = this.group.localToWorld(new THREE.Vector3(localX, pedestalHeight * 0.5, localZ))
                this.game.objects.add(
                    null,
                    {
                        type: 'fixed',
                        friction: 0.3,
                        restitution: 0.1,
                        colliders: [
                            {
                                shape: 'cuboid',
                                parameters: [ 0.4, pedestalHeight * 0.5, 0.4 ],
                                position: { x: worldPos.x, y: worldPos.y, z: worldPos.z }
                            }
                        ]
                    }
                )

                // 2. Icon 3D Block (rounded cube style)
                const iconTex = this.textureLoader.load(`tech-arsenal/icons/${item.id}.png`)
                iconTex.colorSpace = THREE.SRGBColorSpace

                const blockGeom = new THREE.BoxGeometry(0.72, 0.72, 0.2)

                // Face materials: front & back face icon, sides accent color
                const sideMat = new THREE.MeshLambertNodeMaterial({
                    color: item.color || '#2b2b36'
                })
                const iconMat = new THREE.MeshBasicNodeMaterial({
                    map: iconTex,
                    transparent: true
                })

                // Cube faces: [right, left, top, bottom, front, back]
                const materials = [
                    sideMat,
                    sideMat,
                    sideMat,
                    sideMat,
                    iconMat, // Front
                    iconMat  // Back
                ]

                const blockMesh = new THREE.Mesh(blockGeom, materials)
                const blockCenterY = pedestalHeight + 0.52
                blockMesh.position.set(localX, blockCenterY, localZ)
                blockMesh.rotation.x = -0.32
                blockMesh.castShadow = true
                this.group.add(blockMesh)

                // 3. Name plaque in front of pedestal
                const plaqueGeom = new THREE.PlaneGeometry(0.85, 0.22)
                const textCanvas = new TextCanvas(
                    'Amatic SC',
                    '700',
                    0.24,
                    0.85,
                    0.22,
                    200,
                    'center',
                    0.2,
                    true,
                    true
                )
                textCanvas.updateText(item.name.toUpperCase())

                const plaqueMat = new THREE.MeshBasicNodeMaterial({
                    map: textCanvas.texture,
                    transparent: true,
                    side: THREE.DoubleSide
                })
                const plaqueMesh = new THREE.Mesh(plaqueGeom, plaqueMat)
                plaqueMesh.position.set(localX, pedestalHeight - 0.04, localZ + 0.44)
                plaqueMesh.rotation.x = -0.28
                this.group.add(plaqueMesh)

                // Floating data for animation
                this.floatingBlocks.push({
                    mesh: blockMesh,
                    baseY: blockCenterY,
                    offset: globalIndex * 0.35,
                    item: item
                })

                globalIndex++
            })
        })
    }

    setCategorySigns()
    {
        const signs = [
            { text: 'LANGUAGES & CORE', z: -5.7, y: 2.3, width: 3.2 },
            { text: 'FRONTEND ENGINEERING', z: -2.7, y: 1.9, width: 3.4 },
            { text: 'BACKEND, CLOUD & EDGE', z: 0.3, y: 1.5, width: 3.5 },
            { text: 'DATABASES & DEVOPS', z: 3.3, y: 1.1, width: 3.2 }
        ]

        signs.forEach(s =>
        {
            const textCanvas = new TextCanvas(
                'Amatic SC',
                '700',
                0.28,
                s.width,
                0.35,
                200,
                'center',
                0.25,
                true,
                true
            )
            textCanvas.updateText(s.text)

            // Wooden plank backing
            const plankGeom = new THREE.BoxGeometry(s.width + 0.2, 0.4, 0.08)
            const plankMat = new THREE.MeshLambertNodeMaterial({
                color: '#654321'
            })
            const plankMesh = new THREE.Mesh(plankGeom, plankMat)
            plankMesh.position.set(0, s.y, s.z)
            plankMesh.rotation.x = -0.22
            plankMesh.castShadow = true
            this.group.add(plankMesh)

            // Text plane
            const textGeom = new THREE.PlaneGeometry(s.width, 0.35)
            const textMat = new THREE.MeshBasicNodeMaterial({
                map: textCanvas.texture,
                transparent: true
            })
            const textMesh = new THREE.Mesh(textGeom, textMat)
            textMesh.position.set(0, s.y, s.z + 0.045)
            textMesh.rotation.x = -0.22
            this.group.add(textMesh)
        })
    }

    setMainSign()
    {
        // Entrance Arch at z = 7.2
        const signZ = 7.2
        const signWidth = 4.8
        const signHeight = 0.65
        const postHeight = 3.2

        // Left & Right Wooden Posts
        const postGeom = new THREE.CylinderGeometry(0.18, 0.22, postHeight, 8)
        const postMat = new THREE.MeshLambertNodeMaterial({ color: '#543d2b' })

        const leftPost = new THREE.Mesh(postGeom, postMat)
        leftPost.position.set(- 2.6, postHeight * 0.5, signZ)
        leftPost.castShadow = true
        this.group.add(leftPost)

        const rightPost = new THREE.Mesh(postGeom, postMat)
        rightPost.position.set(2.6, postHeight * 0.5, signZ)
        rightPost.castShadow = true
        this.group.add(rightPost)

        // Physical colliders for posts in world space
        const leftWorldPos = this.group.localToWorld(new THREE.Vector3(-2.6, postHeight * 0.5, signZ))
        const rightWorldPos = this.group.localToWorld(new THREE.Vector3(2.6, postHeight * 0.5, signZ))
        this.game.objects.add(null, {
            type: 'fixed',
            friction: 0.3,
            colliders: [
                { shape: 'cuboid', parameters: [ 0.2, postHeight * 0.5, 0.2 ], position: { x: leftWorldPos.x, y: leftWorldPos.y, z: leftWorldPos.z } },
                { shape: 'cuboid', parameters: [ 0.2, postHeight * 0.5, 0.2 ], position: { x: rightWorldPos.x, y: rightWorldPos.y, z: rightWorldPos.z } }
            ]
        })

        // Main Crossbeam Header Board
        const boardGeom = new THREE.BoxGeometry(signWidth, signHeight, 0.12)
        const boardMat = new THREE.MeshLambertNodeMaterial({ color: '#7a4b2c' })
        const boardMesh = new THREE.Mesh(boardGeom, boardMat)
        boardMesh.position.set(0, postHeight - 0.2, signZ)
        boardMesh.castShadow = true
        this.group.add(boardMesh)

        // TextCanvas for "TECH STACK ARSENAL"
        const titleCanvas = new TextCanvas(
            'Amatic SC',
            '700',
            0.42,
            signWidth,
            signHeight,
            200,
            'center',
            0.35,
            true,
            true
        )
        titleCanvas.updateText('TECH STACK ARSENAL')

        const titleGeom = new THREE.PlaneGeometry(signWidth, signHeight)
        const titleMat = new THREE.MeshBasicNodeMaterial({
            map: titleCanvas.texture,
            transparent: true
        })
        const titleMesh = new THREE.Mesh(titleGeom, titleMat)
        titleMesh.position.set(0, postHeight - 0.2, signZ + 0.07)
        this.group.add(titleMesh)
    }

    setInteractivePoint()
    {
        // InteractivePoint positioned at entrance in world coordinates
        const interactPos = this.group.localToWorld(new THREE.Vector3(0, 1.2, 8.4))

        this.interactivePoint = this.game.interactivePoints.create(
            interactPos,
            'Tech Arsenal',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.openModal()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    openModal()
    {
        if(this.game.modals.items.has('tech-arsenal'))
        {
            this.game.modals.open('tech-arsenal')
        }
    }

    update()
    {
        // Gentle smooth vertical float with solid, upright posture
        const elapsed = this.game.ticker.elapsed
        for(const b of this.floatingBlocks)
        {
            b.mesh.position.y = b.baseY + Math.sin(elapsed * 1.8 + b.offset) * 0.04
        }
    }
}
