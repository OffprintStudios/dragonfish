import { ApiProperty } from '@nestjs/swagger';

import { CreateUser, LoginUser } from '@dragonfish/models/users';

export class CreateUserDTO implements CreateUser {
    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly username: string;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly agreedToPolicies: boolean;
}

export class LoginUserDTO implements LoginUser {
    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly rememberMe: boolean;
}
