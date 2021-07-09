import { ApiProperty } from '@nestjs/swagger';

import {
    ChangeEmail,
    ChangePassword,
    ChangeBio,
    ChangeUsername,
    UpdateTagline,
} from '@dragonfish/shared/models/users';

export class ChangeEmailDTO implements ChangeEmail {
    @ApiProperty()
    readonly newEmail: string;

    @ApiProperty()
    readonly currentPassword: string;
}

export class ChangeUsernameDTO implements ChangeUsername {
    @ApiProperty()
    readonly newUsername: string;

    @ApiProperty()
    readonly currentPassword: string;
}

export class ChangePasswordDTO implements ChangePassword {
    @ApiProperty()
    readonly newPassword: string;

    @ApiProperty()
    readonly currentPassword: string;
}

export class ChangeBioDTO implements ChangeBio {
    @ApiProperty()
    readonly bio: string;
}

export class UpdateTaglineDTO implements UpdateTagline {
    @ApiProperty()
    readonly newTagline: string;
}
