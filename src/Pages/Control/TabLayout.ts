import { BrowserWindow, BrowserView } from 'electron';
import { APP_MODE } from '../../models/AppState';
import { Tab } from '../../models/Tab';
import { getControlView, TOP_BAR_HEIGHT } from './Control';


export function layout(mainWindow: BrowserWindow, tabs: Array<Tab>, activeTabId: string, mode: APP_MODE = APP_MODE.STANDARD) {
    const bounds = mainWindow.getBounds()

    const height = bounds.height - TOP_BAR_HEIGHT;
    const width = bounds.width;
    const x = 0;
    const y = TOP_BAR_HEIGHT;

    if (!tabs) {
        console.error("layout missing tabs param")
    }
    try {
        tabs.forEach((tab, i) => {
            switch (mode) {
                case APP_MODE.STANDARD:
                    if (tab.tabId !== activeTabId) {
                        mainWindow.removeBrowserView(tab.view)
                        tab.inMainWindow = false;
                    } else {
                        mainWindow.addBrowserView(tab.view)
                        tab.inMainWindow = true;
                    }

                    tab.view.setBounds({
                        x,
                        y,
                        width,
                        height
                    })

                    break;
                case APP_MODE.GRID:
                    // align in a grid
                    const numCols = Math.ceil(Math.sqrt(tabs.length))
                    const numRows = Math.ceil(tabs.length / numCols)
                    const c = i % numCols;
                    const r = Math.floor(i / numCols)

                    const celWidth = Math.floor(width / numCols);
                    const celHeight = Math.floor(height / numRows);


                    if (!tab.inMainWindow) {
                        console.log("Adding browser view: ", i)
                        mainWindow.addBrowserView(tab.view)
                        tab.inMainWindow = true;
                    }

                    const bounds: Electron.Rectangle = {
                        x: x + celWidth * c,
                        y: y + celHeight * r,
                        width: celWidth,
                        height: celHeight
                    }

                    const prevBounds = tab.view.getBounds()

                    if (bounds.x !== prevBounds.x || bounds.y !== prevBounds.y || bounds.height !== prevBounds.height || bounds.width !== prevBounds.width) {
                        console.log("Bounds changed: ", bounds)
                        tab.view.setBounds(bounds)
                    }

                    break;
            }

        })

        mainWindow.setTopBrowserView(getControlView())
    } catch (err) {
        // this error happens, not sure why
        // console.error(err)
    }

}