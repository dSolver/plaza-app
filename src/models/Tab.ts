import { BrowserView } from "electron";

export interface Tab {
    label: string;
    view: BrowserView;
    tabId: string;
    inMainWindow: boolean;
    cssKey?: string;
}