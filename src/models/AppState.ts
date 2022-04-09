export interface AppState {
    tabs: string[]; // each tab represents a url, the first tab must be the landing page
    activeTab: number; // the index of the tabs that is currently active when using standard mode
    mode: APP_MODE;
}

export enum APP_MODE {
    STANDARD = 'STANDARD',
    GRID = 'GRID'
}

export const defaultAppState = (): AppState => {
    return {
        tabs: ['https://plaza.dsolver.ca'],
        activeTab: 0,
        mode: APP_MODE.STANDARD
    }
}