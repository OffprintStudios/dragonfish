import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateFandomTag, FandomTags, InviteCodes } from '@dragonfish/shared/models/users';
import { UserManagementService } from '../../shared/user-management/services';

@Component({
    selector: 'dragonfish-users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
    currCode: InviteCodes;
    currTags: FandomTags[];
    tagForm = new FormGroup({
        name: new FormControl(null, [Validators.required]),
    })

    constructor(private userManagement: UserManagementService) {}

    ngOnInit() {
        this.fetchAllFandomTags();
    }

    generateCode() {
        this.userManagement.generateCode().subscribe(code => {
            this.currCode = code;
        });
    }

    createFandomTag() {
        const newFandomTag: CreateFandomTag = {
            name: this.tagForm.controls.name.value,
            desc: "Test description",
            parentId: null
        }

        this.userManagement.createFandomTag(newFandomTag).subscribe(tag => {
            this.fetchAllFandomTags();
        });
    }

    fetchAllFandomTags() {
        this.userManagement.fetchAllFandomTags().subscribe(tags => {
            this.currTags = tags;
        })
    }

    createFandomTagAsChildOfSelected() {

    }
}
