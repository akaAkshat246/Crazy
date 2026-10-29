import * as THREE from 'three/webgpu'

let top = 0
export class TextCanvas
{
    constructor(
        fontFamily = 'Comic Sans',
        fontWeight = '400',
        fontSize = 10,
        width = null,
        height = null,
        density = 1,
        horizontalAlign = 'center',
        lineHeight = 1,
        autoFit = true,
        flipY = false
    )
    {
        this.lines = []
        this.fontFamily = fontFamily
        this.fontWeight = fontWeight
        this.baseFontSize = fontSize * density
        this.baseLineHeight = lineHeight * density
        this.density = density
        this.autoFit = autoFit
        this.flipY = flipY

        this.font = `${fontWeight} ${this.baseFontSize}px "${fontFamily}"`
        this.width = Math.ceil(width * density)
        this.height = Math.ceil(height * density)
        this.horizontalAlign = horizontalAlign
        this.lineHeight = this.baseLineHeight

        this.setCanvas()
        this.setTexture()
    }

    setCanvas()
    {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.position = 'fixed'
        this.canvas.style.zIndex = 999
        this.canvas.style.top = `${top}px`
        this.canvas.style.left = 0
        top += this.height + 10
        // document.body.append(this.canvas)

        this.context = this.canvas.getContext('2d')
        this.context.font = this.font
    }

    setTexture()
    {
        this.texture = new THREE.Texture(this.canvas)
        this.texture.colorSpace = THREE.SRGBColorSpace
        this.texture.minFilter = THREE.NearestFilter
        this.texture.magFilter = THREE.NearestFilter
        this.texture.flipY = this.flipY
        this.texture.generateMipmaps = false
    }

    updateText(text)
    {
        this.lines = []

        if(typeof text === 'string')
            this.lines.push(text)
        else if(text instanceof Array)
            this.lines = text

        this.draw()
    }

    getMeasure()
    {
        const output = {}
        output.width = 0
        
        for(const line of this.lines)
        {
            const measure = this.context.measureText(line)

            if(measure.width > output.width)
                output.width = measure.width
        }

        return output
    }

    draw()
    {
        // Clear
        this.context.fillStyle = '#000000'
        this.context.fillRect(0, 0, this.width, this.height)

        if(!this.lines || this.lines.length === 0)
        {
            this.texture.needsUpdate = true
            return
        }

        let lines = [...this.lines]
        let currentFontSize = this.baseFontSize
        let currentLineHeight = this.baseLineHeight

        if(this.autoFit)
        {
            const paddingX = Math.max(12, Math.round(this.width * 0.05))
            const paddingY = Math.max(8, Math.round(this.height * 0.08))
            const maxAllowedWidth = this.width - paddingX * 2
            const maxAllowedHeight = this.height - paddingY * 2

            const lineHeightRatio = this.baseLineHeight > 0 && this.baseFontSize > 0
                ? this.baseLineHeight / this.baseFontSize
                : 0.9

            // Measure at a reference font size to get proportional widths
            const refFontSize = 100
            this.context.font = `${this.fontWeight} ${refFontSize}px "${this.fontFamily}"`

            let maxRefWidth = 0
            for(const line of lines)
            {
                const w = this.context.measureText(line).width
                if(w > maxRefWidth)
                    maxRefWidth = w
            }

            // Calculate max font size allowed by width
            const maxFontSizeForWidth = maxRefWidth > 0 ? (maxAllowedWidth / maxRefWidth) * refFontSize : this.baseFontSize

            // Calculate max font size allowed by height:
            // totalHeight = (lines.length - 1) * lineHeight + fontSize
            const heightFactor = (lines.length - 1) * lineHeightRatio + 1
            const maxFontSizeForHeight = maxAllowedHeight / heightFactor

            currentFontSize = Math.min(this.baseFontSize, maxFontSizeForWidth, maxFontSizeForHeight)
            currentFontSize = Math.max(12, Math.floor(currentFontSize))
            currentLineHeight = Math.round(currentFontSize * lineHeightRatio)
        }

        this.context.font = `${this.fontWeight} ${currentFontSize}px "${this.fontFamily}"`
        this.context.textAlign = this.horizontalAlign
        this.context.textBaseline = 'middle'
        this.context.fillStyle = '#ffffff'

        let i = 0
        for(const line of lines)
        {
            const y = this.height / 2 + (i - (lines.length - 1) / 2) * currentLineHeight

            let x = null
            if(this.horizontalAlign === 'center')
                x = this.width / 2
            else if(this.horizontalAlign === 'left')
                x = Math.max(12, Math.round(this.width * 0.05))
            else if(this.horizontalAlign === 'right')
                x = this.width - Math.max(12, Math.round(this.width * 0.05))

            this.context.fillText(line, x, y)

            i++
        }

        this.texture.needsUpdate = true
    }
}