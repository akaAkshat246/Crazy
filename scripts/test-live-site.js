async function test() {
    const url = 'https://33df8989.akshat-vats-portfolio.pages.dev/'
    console.log('Fetching:', url)
    const res = await fetch(url)
    console.log('Status:', res.status)
    const headers = Object.fromEntries(res.headers.entries())
    console.log('Headers:', headers)
    const text = await res.text()
    console.log('HTML length:', text.length)
    
    // Find all assets in HTML
    const assets = []
    const re = /(?:src|href)=["']([^"']+)["']/g
    let m
    while ((m = re.exec(text)) !== null) {
        if (!m[1].startsWith('http') || m[1].includes('pages.dev')) {
            assets.push(m[1])
        }
    }
    console.log('Referenced assets in HTML:', assets)

    // Test loading referenced JS and WASM
    for (const a of assets) {
        if (a.endsWith('.js') || a.endsWith('.wasm') || a.endsWith('.css')) {
            const assetUrl = new URL(a, url).toString()
            const start = Date.now()
            const aRes = await fetch(assetUrl)
            const duration = Date.now() - start
            const buf = await aRes.arrayBuffer()
            console.log(`Asset ${a}: status=${aRes.status}, size=${(buf.byteLength / 1024).toFixed(1)} KB, time=${duration}ms, content-type=${aRes.headers.get('content-type')}`)
        }
    }
}
test()

