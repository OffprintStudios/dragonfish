import * as User from '../user.actions';

import {
    ChangeBio as BioForm,
    ChangeEmail as EmailForm,
    FrontendUser,
    ChangePassword as PasswordForm,
    UpdateTagline as TaglineForm,
    ChangeUsername as UsernameForm,
} from '@dragonfish/shared/models/users';

import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { FileUploader } from 'ng2-file-upload';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
    @Dispatch()
    public setUser(user: FrontendUser) {
        return new User.SetUser(user);
    }

    @Dispatch()
    public changeEmail(newEmail: EmailForm) {
        return new User.ChangeEmail(newEmail);
    }

    @Dispatch()
    public changeUsername(newUsername: UsernameForm) {
        return new User.ChangeUsername(newUsername);
    }

    @Dispatch()
    public changePassword(newPassword: PasswordForm) {
        return new User.ChangePassword(newPassword);
    }

    @Dispatch()
    public changeBio(newBio: BioForm) {
        return new User.ChangeBio(newBio);
    }

    @Dispatch()
    public updateTagline(newTagline: TaglineForm) {
        return new User.UpdateTagline(newTagline);
    }

    @Dispatch()
    public async uploadAvatar(fileUploader: FileUploader) {
        return new User.ChangeAvatar(fileUploader);
    }

    @Dispatch()
    public uploadCoverPic(fileUploader: FileUploader) {
        return new User.ChangeCoverPic(fileUploader);
    }
}
