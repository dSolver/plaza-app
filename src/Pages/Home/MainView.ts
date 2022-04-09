import { BrowserView, BrowserWindow } from 'electron';
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
    return view;

}

