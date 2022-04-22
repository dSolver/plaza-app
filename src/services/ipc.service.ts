
declare global {
    interface Window {
        plazaAPI: {
            send: (channel: string, param: any) => void;
            listen: (channel: string, handle: (event: any, arg: any[]) => void) => void;
        }
    }
}

export const IPCService = {
    send: (channel: string, msg: any) => {
        console.log("Sending message: ", window.location, msg);
        // window.plazaAPI.send(msg)
        if (window.plazaAPI) {
            window.plazaAPI.send(channel, msg)
        } else {
            console.log("window.plazaAPI did not work, did preload script run?")
        }
    },
    listen: (channel: string, handle: (event: any, arg: any[]) => void) => {
        if (window.plazaAPI) {
            window.plazaAPI.listen(channel, (event: any, arg: any[]) => { handle(event, arg) })
        }
    }
}

if (window.plazaAPI) {
    window.plazaAPI.listen('global', (event, payloads) => {
        if (payloads && payloads[0]) {
            const payload = payloads[0]
            console.log("Received payload from global channel: ", payload)
        }
    })
}