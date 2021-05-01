import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
    FrontendUser,
    ChangeEmail as EmailForm,
    ChangePassword as PasswordForm,
    ChangeBio as BioForm,
    ChangeUsername as UsernameForm,
    UpdateTagline as TaglineForm,
} from '@dragonfish/shared/models/users';
import * as User from '../user.actions';
import { FileUploader } from 'ng2-file-upload';

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
}
