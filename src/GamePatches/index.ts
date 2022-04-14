import { BrowserView } from 'electron';
import { AD } from './antimatter-dimensions';
import { prestigeTree } from './prestige-tree';


const patches: { [domain: string]: string } = {}

export function patch(url: string, view: BrowserView) {
    console.log("Checking patch for ", url)
    const key = Object.keys(patches).find(domain => url.indexOf(domain) >= 0)
    if (key) {
        view.webContents.openDevTools()
        view.webContents.executeJavaScript(patches[key]).then((results)=> {
            console.log("Executed patch for ", url)
        }).catch((err)=> {
            console.log("Failed to execute patch for ", url)
            console.error(err)
        })
    }
}

export function registerPatch(domain: string, code: string) {
    patches[domain] = code
}

// loop through each game patch, a game patch is not available until it is in this array
[AD, prestigeTree].forEach((fn)=> {
    fn()
})