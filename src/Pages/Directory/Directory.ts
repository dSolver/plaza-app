import { BrowserView, BrowserWindow } from "electron/main";

let main: BrowserWindow | undefined;
export function setupDirectory(mainWindow: BrowserWindow, url: string, preload: string) {

    main = mainWindow;


    const view = new BrowserView({
        webPreferences: {
            preload: preload,
            nodeIntegration: true
        }
    })

    mainWindow.addBrowserView(view)


    view.webContents.loadURL(url)

}