import { Component } from '@angular/core';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { Roles } from '@dragonfish/shared/models/users';
import { isAllowed } from '@dragonfish/shared/functions';
import { ElectronService } from 'ngx-electron';
import { ipcMain, ipcRenderer } from 'electron';

@Component({
    selector: 'dragonfish-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    isElectron = false;
    isMacOs = false;
    isWindows = false;

    constructor(public sessionQuery: SessionQuery, public electron: ElectronService) {}

    canSeeDash(userRoles: Roles[]) {
        return isAllowed(userRoles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover]);
    }

    detectElectron() {}
}
