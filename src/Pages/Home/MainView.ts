import { BrowserView, BrowserWindow } from 'electron';
import { CONTROLS_UI_PRELOAD } from '../../index';
import { patch } from '../../GamePatches/index';
import { addTab } from '../Control/Control';

export function setupTabView(mainWindow: BrowserWindow, tabId: string, url: string): BrowserView {
    const view = new BrowserView({
        webPreferences: {
            backgroundThrottling: false,
            preload: CONTROLS_UI_PRELOAD
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

    view.webContents.openDevTools()
    return view;

}

