import msgpack from 'msgpack-lite'
import { v4 as uuidv4 } from 'uuid'
import { Events } from './Events.js'
import { Game } from './Game.js'

export class Server
{
    constructor()
    {
        this.game = Game.getInstance()

        // Unique session ID and author name
        this.uuid = localStorage.getItem('uuid')
        if(!this.uuid)
        {
            this.uuid = uuidv4()
            localStorage.setItem('uuid', this.uuid)
        }
        localStorage.setItem('author', 'Akshat Vats')
        localStorage.setItem('name', 'Akshat Vats')

        this.serverUrl = import.meta.env.VITE_SERVER_URL || 'wss://srv740865.hstgr.cloud:36255'
        this.connected = false
        this.connecting = false
        this.wasConnected = false
        this.initData = null
        this.events = new Events()
        document.documentElement.classList.add('is-server-offline')
    }

    start()
    {
        if(this.serverUrl)
        {
            // First connect attempt
            this.connect()
            
            // Reconnect attempt every 6 seconds if disconnected and not in flight
            setInterval(() =>
            {
                if(!this.connected && !this.connecting)
                    this.connect()
            }, 6000)
        }
    }

    connect()
    {
        if(this.connected || this.connecting || !this.serverUrl)
            return

        this.connecting = true

        try
        {
            this.socket = new WebSocket(this.serverUrl)
            this.socket.binaryType = 'arraybuffer'
        }
        catch(e)
        {
            this.connecting = false
            return
        }

        // Error handling to prevent unhandled socket events or latency
        this.socket.addEventListener('error', () =>
        {
            this.connecting = false
        })

        this.socket.addEventListener('open', () =>
        {
            this.connecting = false
            this.connected = true
            this.wasConnected = true
            document.documentElement.classList.remove('is-server-offline')
            document.documentElement.classList.add('is-server-online')
            this.events.trigger('connected')

            // On message
            this.socket.addEventListener('message', (message) =>
            {
                this.onReceive(message)
            })

            // Notification (only if been running for a while)
            if(this.game.ticker && this.game.ticker.elapsed > 10)
            {
                const html = /* html */`
                    <div class="top">
                        <div class="title">Server connected</div>
                    </div>
                `

                this.game.notifications.show(
                    html,
                    'server-connected',
                    8,
                    null,
                    'server-connected'
                )
            }

            // On close
            this.socket.addEventListener('close', () =>
            {
                this.connecting = false
                const hadConnection = this.connected
                this.connected = false
                document.documentElement.classList.add('is-server-offline')
                document.documentElement.classList.remove('is-server-online')

                // Notification only if previously active
                if(hadConnection && this.game.ticker && this.game.ticker.elapsed > 10)
                {
                    const html = /* html */`
                        <div class="top">
                            <div class="title">Server disconnected</div>
                        </div>
                    `

                    this.game.notifications.show(
                        html,
                        'server-disconnected',
                        8,
                        null,
                        'server-disconnected'
                    )
                }
                
                this.events.trigger('disconnected')
            })
        })
    }

    onReceive(message)
    {
        try
        {
            const data = this.decode(message.data)
            if(this.initData === null)
                this.initData = data

            this.events.trigger('message', [ data ])
        }
        catch(e)
        {
            // Ignore malformed packet
        }
    }

    send(message)
    {
        if(!this.connected || !this.socket || this.socket.readyState !== WebSocket.OPEN)
            return false

        try
        {
            this.socket.send(this.encode({
                uuid: this.uuid,
                author: 'Akshat Vats',
                name: 'Akshat Vats',
                ...message
            }))
            return true
        }
        catch(e)
        {
            return false
        }
    }

    decode(data)
    {
        return msgpack.decode(new Uint8Array(data))
    }

    encode(data)
    {
        return msgpack.encode(data)
    }
}
