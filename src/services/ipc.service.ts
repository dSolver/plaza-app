
declare global {
    interface Window {
        electronAPI: {
            send: (channel: string, param: any) => void;
            listen: (channel: string, handle: (event: any, arg: any[]) => void) => void;
        }
    }
}

export const IPCService = {
    send: (channel: string, msg: any) => {
        console.log("Sending message: ", msg);
        // window.electronAPI.send(msg)
        if (window.electronAPI) {
            window.electronAPI.send(channel, msg)
        } else {
            console.log("window.electronAPI did not work, did preload script run?")
        }
    },
    listen: (channel: string, handle: (event: any, arg: any[]) => void) => {
        if (window.electronAPI) {
            window.electronAPI.listen(channel, (event: any, arg: any[]) => { handle(event, arg) })
        }
    }
}

if (window.electronAPI) {
    window.electronAPI.listen('global', (event, payloads) => {
        if (payloads && payloads[0]) {
            const payload = payloads[0]
            console.log("Received payload from global channel: ", payload)
        }
    })
}