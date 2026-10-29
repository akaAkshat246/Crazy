import { Events } from './Events.js'
import { Game } from './Game.js'

export class Quality
{
    constructor()
    {
        this.game = Game.getInstance()

        this.events = new Events()

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        const isLowEndHardware = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
        
        // Default to performant mode for mobile/low-end devices, or high for capable hardware
        this.level = isLowEndHardware ? 1 : 0

        this.setDynamicPerformance()

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.game.debug.panel.addFolder({
                title: '⚙️ Quality',
                expanded: false,
            })

            this.game.debug.addButtons(
                debugPanel,
                {
                    low: () =>
                    {
                        this.changeLevel(1)
                    },
                    high: () =>
                    {
                        this.changeLevel(0)
                    },
                },
                'change'
            )
        }
    }

    setDynamicPerformance()
    {
        let lowFpsTicks = 0

        // Monitor FPS every 1.5s to prevent stutter/lag
        setInterval(() =>
        {
            if(!this.game.ticker) return

            const delta = this.game.ticker.delta || 0.016
            const fps = 1 / Math.max(0.001, delta)

            // If FPS struggles below 38 FPS on level 0, auto-switch to level 1 for 60 FPS fluidity
            if(fps < 38 && this.level === 0)
            {
                lowFpsTicks++
                if(lowFpsTicks >= 2)
                {
                    this.changeLevel(1)
                }
            }
            else
            {
                lowFpsTicks = Math.max(0, lowFpsTicks - 1)
            }
        }, 1500)
    }

    changeLevel(level = 0)
    {
        if(level === this.level)
            return
            
        this.level = level
        this.events.trigger('change', [ this.level ])
    }
}
