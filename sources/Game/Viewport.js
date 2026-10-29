import { Events } from './Events.js'

export class Viewport
{
    constructor(domElement)
    {
        this.domElement = domElement

        this.events = new Events()
        
        this.measure()
        this.setResize()
    }

    measure()
    {
        const bounding = this.domElement.getBoundingClientRect()

        this.width = bounding.width
        this.height = bounding.height
        this.ratio = this.width / this.height

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 800

        this.pixelRatioPure = window.devicePixelRatio || 1
        // On high-DPR mobile screens (e.g. Retina DPR 3), cap to 1.5 to eliminate GPU fill-rate latency and thermal throttling
        // Desktop can comfortably run at 2.0
        this.pixelRatioMax = isMobile ? 1.5 : 2
        this.pixelRatio = Math.min(this.pixelRatioPure, this.pixelRatioMax)
    }

    setResize()
    {
        const throttleDuration = 300
        let throttleTimeout = null

        const onResize = () =>
        {
            this.measure()
            this.events.trigger('change')

            if(throttleTimeout)
            {
                clearTimeout(throttleTimeout)
            }

            throttleTimeout = setTimeout(() =>
            {
                throttleTimeout = null
                this.events.trigger('throttleChange')
            }, throttleDuration)
        }

        addEventListener('resize', onResize, { passive: true })

        // Handle mobile orientation changes seamlessly
        addEventListener('orientationchange', () =>
        {
            setTimeout(onResize, 100)
            setTimeout(onResize, 300)
        }, { passive: true })

        // Visual viewport support for dynamic mobile browser address bars
        if(window.visualViewport)
        {
            window.visualViewport.addEventListener('resize', onResize, { passive: true })
        }
    }
}
