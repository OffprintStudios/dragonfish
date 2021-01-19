import { FrontendUser, ChangeEmail as EmailForm, ChangePassword as PasswordForm, 
    ChangeProfile as ProfileForm, ChangeUsername as UsernameForm, 
    UpdateTagline as TaglineForm } from "@pulp-fiction/models/users";
import { FileUploader } from "ng2-file-upload";

export namespace User {
    export class SetUser {
        static readonly type = '[User] SetUser';
        constructor (public user: FrontendUser) {}
    }

    export class ChangeEmail {
        static readonly type = '[User] ChangeEmail';
        constructor (public newEmail: EmailForm) {}
    }

    export class ChangeUsername {
        static readonly type = '[User] ChangeUsername';
        constructor (public newUsername: UsernameForm) {}
    }

    export class ChangePassword {
        static readonly type = '[User] ChangePassword';
        constructor (public newPassword: PasswordForm) {}
    }

    export class ChangeProfile {
        static readonly type = '[User] ChangeProfile';
        constructor (public newProfile: ProfileForm) {}
    }

    export class AgreeToPolicies {
        static readonly type = '[User] AgreeToPolicies';
        constructor () {}
    }

    export class ChangeAvatar {
        static readonly type = '[User] ChangeAvatar';
        constructor (public uploader: FileUploader) {}
    }

    export class UpdateTagline {
        static readonly type = '[User] UpdateTagline';
        constructor (public newTagline: TaglineForm) {}
    }
}