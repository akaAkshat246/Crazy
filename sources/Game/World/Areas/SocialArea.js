import * as THREE from 'three/webgpu'
import { Game } from '../../Game.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import socialData from '../../../data/social.js'
import { InstancedGroup } from '../../InstancedGroup.js'
import { Area } from './Area.js'
import { View } from '../../View.js'

export class SocialArea extends Area
{
    constructor(model)
    {
        super(model)

        this.center = this.references.items.get('center')[0].position

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '👨‍🦲 Social',
                expanded: false,
            })
        }

        this.setLinks()
        this.setFans()
        this.setOnlyFans()
        this.setStatue()
        // this.setFWA()
        this.setAchievement()
    }

    setLinks()
    {
        this.textureLoader = new THREE.TextureLoader()
        this.floatingBlocks = []
        this.blocksGroup = new THREE.Group()
        this.game.scene.add(this.blocksGroup)

        const radius = 6
        const pedestalHeight = 0.55
        const pedestalGeom = new THREE.CylinderGeometry(0.38, 0.44, pedestalHeight, 16)
        const pedestalMat = new THREE.MeshLambertNodeMaterial({
            color: '#23202b'
        })
        const blockGeom = new THREE.BoxGeometry(0.72, 0.72, 0.2)

        let i = 0

        for(const link of socialData)
        {
            const angle = i * Math.PI / (socialData.length - 1)
            const position = this.center.clone()
            position.x += Math.cos(angle) * radius
            position.y = 0
            position.z -= Math.sin(angle) * radius

            // 1. Pedestal Stand
            const pedestalMesh = new THREE.Mesh(pedestalGeom, pedestalMat)
            pedestalMesh.position.set(position.x, pedestalHeight * 0.5, position.z)
            pedestalMesh.castShadow = true
            pedestalMesh.receiveShadow = true
            this.blocksGroup.add(pedestalMesh)

            // Physical collider so car collides with pedestal
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
                            position: { x: position.x, y: pedestalHeight * 0.5, z: position.z }
                        }
                    ]
                }
            )

            // 2. Official 3D Icon Block (matching Tech Arsenal colors and squircle texture)
            const iconPath = link.icon || `social/icons/${link.id || link.name.toLowerCase()}.png`
            const iconTex = this.textureLoader.load(iconPath)
            iconTex.colorSpace = THREE.SRGBColorSpace

            const sideMat = new THREE.MeshLambertNodeMaterial({
                color: link.color || '#2b2b36'
            })
            const iconMat = new THREE.MeshBasicNodeMaterial({
                map: iconTex,
                transparent: true
            })

            const materials = [
                sideMat, // +X right
                sideMat, // -X left
                sideMat, // +Y top
                sideMat, // -Y bottom
                iconMat, // +Z front
                iconMat  // -Z back
            ]

            const blockMesh = new THREE.Mesh(blockGeom, materials)
            const blockBaseY = pedestalHeight + 0.42
            blockMesh.position.set(position.x, blockBaseY, position.z)

            // Orient the block facing outward from center towards the player
            const lookTarget = new THREE.Vector3(
                position.x + (position.x - this.center.x),
                blockBaseY,
                position.z + (position.z - this.center.z)
            )
            blockMesh.lookAt(lookTarget)
            blockMesh.castShadow = true
            this.blocksGroup.add(blockMesh)

            // Floating bobbing animation
            this.floatingBlocks.push({
                mesh: blockMesh,
                baseY: blockBaseY,
                offset: i * 0.35
            })

            // 3. Interactive Point directly above block
            const interactivePos = position.clone()
            interactivePos.y = blockBaseY + 0.65

            this.interactivePoint = this.game.interactivePoints.create(
                interactivePos,
                link.name,
                link.align === 'left' ? InteractivePoints.ALIGN_LEFT : InteractivePoints.ALIGN_RIGHT,
                InteractivePoints.STATE_CONCEALED,
                () =>
                {
                    if(link.url)
                        window.open(link.url, '_blank')
                    else if(link.modal)
                        this.game.modals.open(link.modal)
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

            i++
        }
    }

    setFans()
    {
        const baseFan = this.references.items.get('fan')[0]
        baseFan.castShadow = true
        baseFan.receiveShadow = true

        baseFan.position.set(0, 0, 0)

        // Update materials 
        this.game.materials.updateObject(baseFan)

        baseFan.removeFromParent()
        
        this.fans = {}
        this.fans.spawnerPosition = this.references.items.get('onlyFans')[0].position
        this.fans.count = 30
        this.fans.visibleCount = 0
        this.fans.currentIndex = 0
        this.fans.mass = 0.02
        this.fans.objects = []

        const references = []

        for(let i = 0; i < this.fans.count; i++)
        {
            // Reference
            const reference = new THREE.Object3D()

            reference.position.copy(this.fans.spawnerPosition)
            reference.position.y += 99
            reference.needsUpdate = true
            references.push(reference)
            
            // Object
            const object = this.game.objects.add(
                {
                    model: reference,
                    updateMaterials: false,
                    castShadow: false,
                    receiveShadow: false,
                    parent: null,
                },
                {
                    type: 'dynamic',
                    position: reference.position,
                    rotation: reference.quaternion,
                    friction: 0.7,
                    mass: this.fans.mass,
                    sleeping: true,
                    enabled: false,
                    colliders: [ { shape: 'cuboid', parameters: [ 0.45, 0.65, 0.45 ], category: 'object' } ],
                    waterGravityMultiplier: - 1
                },
            )

            this.fans.objects.push(object)
        }

        this.fans.instancedGroup = new InstancedGroup(references, baseFan)

        this.fans.pop = () =>
        {
            const object = this.fans.objects[this.fans.currentIndex]

            const spawnPosition = this.fans.spawnerPosition.clone()
            spawnPosition.x += (Math.random() - 0.5) * 4
            spawnPosition.y += 4 * Math.random()
            spawnPosition.z += (Math.random() - 0.5) * 4
            object.physical.body.setTranslation(spawnPosition)
            object.physical.body.setEnabled(true)
            object.physical.body.setLinvel({ x: 0, y: 0, z: 0 })
            object.physical.body.setAngvel({ x: 0, y: 0, z: 0 })
            object.physical.body.wakeUp()
            // this.game.ticker.wait(1, () =>
            // {
            //     object.physical.body.applyImpulse({
            //         x: (Math.random() - 0.5) * this.fans.mass * 2,
            //         y: Math.random() * this.fans.mass * 3,
            //         z: this.fans.mass * 7
            //     }, true)
            //     object.physical.body.applyTorqueImpulse({ x: 0, y: 0, z: 0 }, true)
            // })

            this.fans.currentIndex = (this.fans.currentIndex + 1) % this.fans.count

            this.fans.visibleCount = Math.min(this.fans.visibleCount + 1, this.fans.count)

            // Sound
            this.game.audio.groups.get('click').play(true)

            // Achievement
            this.game.achievements.setProgress('fan', 1)
        }
    }

    setOnlyFans()
    {
        const interactiveArea = this.game.interactivePoints.create(
            this.references.items.get('onlyFans')[0].position,
            'OnlyFans',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.fans.pop()
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

    setStatue()
    {
        this.statue = {}
        this.statue.body = this.references.items.get('statue')[0].userData.object.physical.body
        this.statue.down = false
    }

    setFWA()
    {
        this.fwa = {}

        // Confetti
        let i = 0
        this.fwa.positions = [
            new THREE.Vector3(23.5, 0, -18.5),
            new THREE.Vector3(27, 0, -19.5),
        ]
        const pop = () =>
        {
            i++
            const position = this.fwa.positions[i % this.fwa.positions.length]
            this.game.world.confetti.pop(position)
            
            setTimeout(pop, 500 + Math.random() * 1500)
        }
        setTimeout(pop, 2000)
        
        // Interactive points
        game.interactivePoints.temporaryHide()

        // Input => start
        this.game.inputs.addActions([
            { name: 'startFWA', categories: [ 'intro', 'modal', 'menu', 'racing', 'cinematic', 'wandering' ], keys: [ 'Keyboard.k' ] },
            { name: 'winFWA', categories: [ 'intro', 'modal', 'menu', 'racing', 'cinematic', 'wandering' ], keys: [ 'Keyboard.j' ] },
        ])
        this.game.inputs.events.on('startFWA', (action) =>
        {
            if(action.active)
            {
                // View
                game.view.zoom.baseRatio = 0.55
                game.view.zoom.ratio = 0.55
                game.view.zoom.smoothedRatio = 0.55
                game.view.focusPoint.position.set(25, 0, -19.2)
                game.view.focusPoint.isTracking = false
                window.setTimeout(() =>
                {
                    this.game.view.setMode(View.MODE_FREE)
                }, 1000)

                // Weather
                this.game.weather.override.start(
                    {
                        humidity: 0,
                        electricField: 0,
                        clouds: 0,
                        wind: 0
                    },
                    0
                )
        
                // Day cycles
                this.game.dayCycles.override.start(
                    {
                        progress: 0.87
                    },
                    0
                )
                
                // Buttons
                document.querySelector('.js-menu-trigger').style.display = 'none'
                document.querySelector('.js-map-trigger').style.display = 'none'
            }
        })
        this.game.inputs.events.on('winFWA', (action) =>
        {
            if(action.active)
            {
                this.game.achievements.setProgress('foty', 1)
            }
        })
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'social')
        })
    }

    update()
    {
        if(this.floatingBlocks && this.floatingBlocks.length > 0)
        {
            const elapsed = this.game.ticker.elapsed
            for(const b of this.floatingBlocks)
            {
                b.mesh.position.y = b.baseY + Math.sin(elapsed * 1.8 + b.offset) * 0.04
            }
        }
        if(this.fans.visibleCount)
        {
            let allFansSleeping = true
            for(const fan of this.fans.objects)
                allFansSleeping = allFansSleeping && fan.physical.body.isSleeping()

            if(!allFansSleeping)
                this.fans.instancedGroup.updateBoundings()
        }
    
        if(this.statue && !this.statue.down && !this.statue.body.isSleeping())
        {
            const statueUp = new THREE.Vector3(0, 1, 0)
            statueUp.applyQuaternion(this.statue.body.rotation())
            if(statueUp.y < 0.25)
            {
                this.statue.down = true
                this.game.achievements.setProgress('statueDown', 1)
            }
        }

        for(const object of this.fans.objects)
        {
            if(!object.physical.body.isSleeping() && object.physical.body.isEnabled())
                object.visual.object3D.needsUpdate = true
        }
    }
}