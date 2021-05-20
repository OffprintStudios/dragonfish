import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FandomTags, InviteCodes } from '@dragonfish/shared/models/users';
import { UserManagementService } from '../../shared/user-management/services';

@Component({
    selector: 'dragonfish-users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent {
    currCode: InviteCodes;
    currTag: FandomTags;
    tagForm = new FormGroup({
        name: new FormControl(null, [Validators.required]),
    })

    constructor(private userManagement: UserManagementService) {}

    generateCode() {
        this.userManagement.generateCode().subscribe(code => {
            this.currCode = code;
        });
    }

    createFandomTag() {
        const tagInfo: FandomTags = {
            name: this.tagForm.controls.name.value,
            desc: "Test description",
            parent: null,
            children: null,
        }

        this.userManagement.createFandomTag(tagInfo).subscribe(tag => {
            this.currTag = tag;
        });
    }
}
