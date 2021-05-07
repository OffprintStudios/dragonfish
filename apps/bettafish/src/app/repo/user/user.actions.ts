import {
    ChangeBio as BioForm,
    ChangeEmail as EmailForm,
    FrontendUser,
    ChangePassword as PasswordForm,
    UpdateTagline as TaglineForm,
    ChangeUsername as UsernameForm,
} from '@dragonfish/shared/models/users';

import { FileUploader } from 'ng2-file-upload';

export class SetUser {
    static readonly type = '[User] Set User';
    constructor(public user: FrontendUser | null) {}
}

export class ChangeEmail {
    static readonly type = '[User] Change Email';
    constructor(public newEmail: EmailForm) {}
}

export class ChangeUsername {
    static readonly type = '[User] Change Username';
    constructor(public newUsername: UsernameForm) {}
}

export class ChangePassword {
    static readonly type = '[User] Change Password';
    constructor(public newPassword: PasswordForm) {}
}

export class ChangeBio {
    static readonly type = '[User] Change Bio';
    constructor(public newBio: BioForm) {}
}

export class AgreeToPolicies {
    static readonly type = '[User] Agree To Policies';
}

export class ChangeAvatar {
    static readonly type = '[User] Change Avatar';
    constructor(public uploader: FileUploader) {}
}

export class ChangeCoverPic {
    static readonly type = '[User] Change Cover Pic';
    constructor(public uploader: FileUploader) {}
}

export class UpdateTagline {
    static readonly type = '[User] Update Tagline';
    constructor(public newTagline: TaglineForm) {}
}
