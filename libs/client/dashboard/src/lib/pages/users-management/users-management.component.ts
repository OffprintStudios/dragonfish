import { Component } from '@angular/core';
import { InviteCodes } from '@dragonfish/shared/models/users';
import { UserManagementService } from '../../shared/user-management/services';

@Component({
    selector: 'dragonfish-users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent {
    currCode: InviteCodes;

    constructor(private userManagement: UserManagementService) {}

    generateCode() {
        this.userManagement.generateCode().subscribe(code => {
            this.currCode = code;
        });
    }
}
