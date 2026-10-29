import { Game } from '../../Game.js'
import { AltarArea } from './AltarArea.js'
import { CookieArea } from './CookieArea.js'
import { LandingArea } from './LandingArea.js'
import { ProjectsArea } from './ProjectsArea.js'
import { LabArea } from './LabArea.js'
import { CareerArea } from './CareerArea.js'
import { SocialArea } from './SocialArea.js'
import { ToiletArea } from './ToiletArea.js'
import { BowlingArea } from './BowlingArea.js'
import { CircuitArea } from './CircuitArea.js'
import { BehindTheSceneArea } from './BehindTheSceneArea.js'
import { AchievementsArea } from './AchievementsArea.js'
import { EasterArea } from './EasterArea.js'

export class Areas
{
    constructor()
    {
        this.game = Game.getInstance()

        const list = [
            [ 'achievements', AchievementsArea ],
            [ 'altar', AltarArea ],
            [ 'behindTheScene', BehindTheSceneArea ],
            [ 'bowling', BowlingArea ],
            [ 'career', CareerArea ],
            [ 'circuit', CircuitArea ],
            [ 'cookie', CookieArea ],
            [ 'lab', LabArea ],
            [ 'landing', LandingArea ],
            [ 'projects', ProjectsArea ],
            [ 'social', SocialArea ],
            [ 'toilet', ToiletArea ],
        ]

        const model = [...this.game.resources.areasModel.scene.children]
        
        for(const child of model)
        {
            for(const [ name, AreaClass ] of list)
            {
                if(child.name.startsWith(name))
                {
                    try
                    {
                        if(name === 'circuit')
                        {
                            // Remove physical colliders for leaderboard arch
                            const physicalFixed = child.children.find(c => c.name.startsWith('physicalFixed.006'))
                            if(physicalFixed)
                            {
                                physicalFixed.children = physicalFixed.children.filter(
                                    c => c.name !== 'cuboid.180' && c.name !== 'cuboid.186'
                                )
                            }

                            // Prevent Text.002 (LEADERBOARD glowing 3D text) from being added
                            const textLeaderboard = child.children.find(c => c.name.startsWith('Text.002'))
                            if(textLeaderboard)
                            {
                                textLeaderboard.userData.preventAutoAdd = true
                                textLeaderboard.visible = false
                            }

                            // Remove Leaderboard arch, clock and RESET 3D text from Cube.088
                            const deco = child.children.find(c => c.name.startsWith('Cube.088'))
                            if(deco && deco.geometry && deco.geometry.index)
                            {
                                const geom = deco.geometry
                                const posAttr = geom.attributes.position
                                const indexAttr = geom.index
                                const localPos = deco.position
                                const newIndices = []

                                for(let i = 0; i < indexAttr.count; i += 3)
                                {
                                    const i1 = indexAttr.getX(i)
                                    const i2 = indexAttr.getX(i + 1)
                                    const i3 = indexAttr.getX(i + 2)

                                    const d1 = Math.hypot(posAttr.getX(i1) + localPos.x - (-1.895), posAttr.getZ(i1) + localPos.z - 9.346)
                                    const d2 = Math.hypot(posAttr.getX(i2) + localPos.x - (-1.895), posAttr.getZ(i2) + localPos.z - 9.346)
                                    const d3 = Math.hypot(posAttr.getX(i3) + localPos.x - (-1.895), posAttr.getZ(i3) + localPos.z - 9.346)

                                    if(d1 >= 4.5 && d2 >= 4.5 && d3 >= 4.5)
                                    {
                                        newIndices.push(i1, i2, i3)
                                    }
                                }
                                geom.setIndex(newIndices)
                                geom.computeVertexNormals()
                            }
                        }

                        if(name === 'social')
                        {
                            const oldSocialBlockNames = [
                                'gitHubPhysicalDynamic',
                                'linkedInPhysicalDynamic',
                                'mailPhysicalDynamic',
                                'xPhysicalDynamic',
                                'youtubePhysicalDynamic',
                                'twitchPhysicalDynamic',
                                'discordPhysicalDynamic',
                                'blueskyPhysicalDynamic.001',
                                'baguiraPhysicalDynamic',
                                'boyPhysicalDynamic',
                                'sudoPhysicalDynamic'
                            ]
                            child.traverse(c =>
                            {
                                if(oldSocialBlockNames.includes(c.name))
                                {
                                    c.userData.preventAutoAdd = true
                                    c.visible = false
                                }
                            })
                        }

                        this[name] = new AreaClass(child)
                    }
                    catch(e)
                    {
                        console.error('Failed area:', name, e)
                    }
                }
            }
        }

        // // Test how many areas are visible
        // this.game.ticker.events.on('tick', () =>
        // {
        //     let i = 0
        //     if(this.achievements.frustum.isIn)
        //         i++
        //     if(this.altar.frustum.isIn)
        //         i++
        //     if(this.behindTheScene.frustum.isIn)
        //         i++
        //     if(this.bowling.frustum.isIn)
        //         i++
        //     if(this.career.frustum.isIn)
        //         i++
        //     if(this.circuit.frustum.isIn)
        //         i++
        //     if(this.cookie.frustum.isIn)
        //         i++
        //     if(this.lab.frustum.isIn)
        //         i++
        //     if(this.landing.frustum.isIn)
        //         i++
        //     if(this.projects.frustum.isIn)
        //         i++
        //     if(this.social.frustum.isIn)
        //         i++
        //     if(this.toilet.frustum.isIn)
        //         i++

        //     console.log(i)
        // }, 6)
    }
}