import {
    FrontendUser,
    ChangeEmail as EmailForm,
    ChangePassword as PasswordForm,
    ChangeProfile as ProfileForm,
    ChangeUsername as UsernameForm,
    UpdateTagline as TaglineForm,
} from '@dragonfish/models/users';
import { FileUploader } from 'ng2-file-upload';

export namespace User {
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

    export class ChangeProfile {
        static readonly type = '[User] Change Profile';
        constructor(public newProfile: ProfileForm) {}
    }

    export class AgreeToPolicies {
        static readonly type = '[User] Agree To Policies';
        constructor() {}
    }

    export class ChangeAvatar {
        static readonly type = '[User] Change Avatar';
        constructor(public uploader: FileUploader) {}
    }

    export class UpdateTagline {
        static readonly type = '[User] Update Tagline';
        constructor(public newTagline: TaglineForm) {}
    }
}
