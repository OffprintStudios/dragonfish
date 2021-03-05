import { Component, OnInit } from '@angular/core';
import { InviteCodes } from '@dragonfish/models/users';
import { UserManagementService } from '../../shared/user-management/services';

@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.less'],
})
export class UsersManagementComponent implements OnInit {
    currCode: InviteCodes;

    constructor(private userManagement: UserManagementService) {}

    ngOnInit(): void {}

    generateCode() {
        this.userManagement.generateCode().subscribe(code => {
            this.currCode = code;
        });
    }
}
