import fs from 'fs'
import path from 'path'

const gameJs = fs.readFileSync('sources/Game/Game.js', 'utf8')
const regex = /\[\s*'[^']+',\s*`([^`]+)`/g
let match
const missing = []
const available = []

while ((match = regex.exec(gameJs)) !== null) {
    let file = match[1]
    file = file.split('?')[0]
    file = file.replace('${compressedModelSuffix}', '-compressed')
    file = file.replace('${compressedTextureExtension}', 'ktx')
    file = file.replace('${cb}', '')
    
    const fullPath = path.join('static', file)
    if (!fs.existsSync(fullPath)) {
        missing.push(file)
    } else {
        available.push(file)
    }
}

console.log('Available compressed assets:', available.length)
console.log('Missing compressed assets:', missing)

