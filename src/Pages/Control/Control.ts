import { BrowserWindow, BrowserView, ipcMain, IpcMainEvent, IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { APP_MODE } from '../../models/AppState';
import { Tab } from '../../models/Tab';
import { setupTabView } from '../Home/MainView';
import { layout } from './TabLayout';

export const TOP_BAR_HEIGHT = 48

const tabs: Array<Tab> = []

let main: BrowserWindow | undefined;
let controlView: BrowserView | undefined;

let activeTabId: string | undefined;

let mode: APP_MODE = APP_MODE.STANDARD

export function getControlView(){
    return controlView
}
export function setupControlView(mainWindow: BrowserWindow, url: string, preload: string) {

    main = mainWindow;
    const view = new BrowserView({
        webPreferences: {
            preload: preload,
            nodeIntegration: true,
        }
    })

    mainWindow.addBrowserView(view)

    mainWindow.setTopBrowserView(view)

    view.webContents.loadURL(url)

    // open dev tools for the control ui
    view.webContents.openDevTools({
        mode: 'undocked'
    });

    updateBounds()

    controlView = view;

}

export function updateBounds() {
    if (main && controlView) {
        const bounds = main.getBounds()
        controlView.setBounds({
            x: 0,
            y: 0,
            width: bounds.width,
            height: TOP_BAR_HEIGHT
        })
    }

}
export function relayout() {
    updateBounds()
    layout(main, tabs, activeTabId, mode)
}

export const addTab = (tabId: string, label: string, url: string) => {

    if (!tabs.some(tab => tab.tabId === tabId)) {
        const view = setupTabView(main, tabId, url)
        tabs.push({
            tabId,
            label,
            view,
            inMainWindow: false
        })

        view.webContents.on('dom-ready', (event: Electron.Event) => {
            tabs.find(t => t.tabId === tabId).label = view.webContents.getTitle()
            sendTabs()
        })

        view.webContents.on('did-navigate', (event: Electron.Event)=> {
            tabs.find(t => t.tabId === tabId).label = view.webContents.getTitle()
            sendTabs()
        })

        sendTabs()
    }


    setActiveTab(tabId);
}

export const setActiveTab = (tabId: string) => {

    activeTabId = tabId;


    layout(main, tabs, activeTabId, mode)

    sendTabs()
}

export const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.tabId === tabId)

    if (tabIndex === -1) {
        // something screwed up, ignore this command
        addTab('main', 'plaza', 'https://plaza.dsolver.ca')
    } else {
        const toClose = tabs[tabIndex];

        main.removeBrowserView(toClose.view);

        const nextTab = tabs[tabIndex + 1] || tabs[tabIndex - 1]

        if (!nextTab) {
            addTab('main', 'plaza', 'https://plaza.dsolver.ca')
            return;
        } else {
            // switch active tab
            activeTabId = nextTab.tabId;

            tabs.splice(tabIndex, 1)


            layout(main, tabs, activeTabId, mode)
            sendTabs()
        }
    }

}
export const sendTabs = () => {
    controlView.webContents.send('control', {
        action: 'update-tabs',
        tabs: tabs.map(t => ({ label: t.label, tabId: t.tabId })),
        activeTabId,
        mode
    })
}


export const goBack = () => {
    const activeTab = tabs.find(t => t.tabId === activeTabId)
    if (activeTab) {
        activeTab.view.webContents.goBack()
    }
}

export const changeMode = (newMode: APP_MODE) => {
    mode = newMode

    layout(main, tabs, activeTabId, mode)
    sendTabs()
}

// Event Listener on controls
ipcMain.handle('control', (event, ...args) => {
    if (args[0]) {
        if (args[0].action) {
            const cmd = args[0]

            switch (cmd.action) {
                case 'open-tab':
                    addTab(cmd.tabId, cmd.label, cmd.url);
                    break;
                case 'switch-tab':
                    setActiveTab(cmd.tabId);
                    break;
                case 'query-tabs':
                    sendTabs()
                    break;
                case 'back':
                    goBack()
                    break;
                case 'change-mode':
                    changeMode(cmd.mode);
                    break;
                case 'close-tab':
                    closeTab(cmd.tabId);
                    break;
            }
        }
    }
})
