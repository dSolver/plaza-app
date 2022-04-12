import { BrowserView, BrowserWindow } from 'electron';
import { patch } from '../../GamePatches/index';
import { addTab } from '../Control/Control';

export function setupTabView(mainWindow: BrowserWindow, tabId: string, url: string): BrowserView {
    const view = new BrowserView({
        webPreferences: {
            backgroundThrottling: false
        }
    })

    mainWindow.addBrowserView(view)

    view.webContents.loadURL(url)


    view.webContents.setWindowOpenHandler((details: Electron.HandlerDetails)=> {

        addTab(`tab:${details.url}`, details.url, details.url)
        return {
            action: 'deny'
        }
    })

    view.webContents.on('dom-ready', ()=> {
        patch(url, view)
    })
    return view;

}

