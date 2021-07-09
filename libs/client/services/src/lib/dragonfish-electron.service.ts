import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({ providedIn: 'root' })
export class DragonfishElectronService {
    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;

    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    constructor() {
        if (this.isElectron) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.remote = window.require('@electron/remote');
        }
    }

    get isMacOS() {
        return this.isElectron && this.remote.process.platform === 'darwin';
    }

    get isWindows() {
        return this.isElectron && this.remote.process.platform === 'win32';
    }

    get isLinux() {
        return this.isElectron && this.remote.process.platform === 'linux';
    }
}
