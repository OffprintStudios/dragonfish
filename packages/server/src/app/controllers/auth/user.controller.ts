import {
    Controller,
    UseGuards,
    Patch,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Roles, FrontendUser } from '@dragonfish/models/users';
import { RolesGuard } from '../../guards';
import { ChangeEmailDTO, ChangePasswordDTO, ChangeProfileDTO, ChangeUsernameDTO, UpdateTaglineDTO } from './models';
import { IUser } from '../../shared/auth';
import { IImages } from '../../shared/images';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/models/auth';

@Controller('user')
export class UserController {
    constructor(@Inject('IUser') private readonly user: IUser, @Inject('IImages') private readonly images: IImages) {}

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-email')
    async changeEmail(@User() user: JwtPayload, @Body() changeEmailRequest: ChangeEmailDTO) {
        return await this.user.changeEmail(user, changeEmailRequest);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-username')
    async changeUsername(@User() user: JwtPayload, @Body() changeUsernameRequest: ChangeUsernameDTO) {
        // TODO: Determine how we want to handle this.
        // We should decide what--and if we need--restrictions to have around name changes.
        //return await this.user.changeUsername(user, changeUsernameRequest);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-password')
    async changePassword(@User() user: JwtPayload, @Body() newPassword: ChangePasswordDTO) {
        return await this.user.changePassword(user, newPassword);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('update-profile')
    async updateProfile(@User() user: JwtPayload, @Body() newProfile: ChangeProfileDTO) {
        if (newProfile.bio && newProfile.bio.length > 160) {
            throw new BadRequestException('Your bio must not be longer than 160 characters.');
        }
        return await this.user.updateProfile(user, newProfile);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Post('agree-to-policies')
    async agreeToPolicies(@User() user: JwtPayload): Promise<FrontendUser> {
        return await this.user.agreeToPolicies(user);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: any, @User() user: JwtPayload) {
        const avatarUrl = await this.images.upload(avatarImage, user.sub, 'avatars');
        const avatar = `${process.env.IMAGES_HOSTNAME}/avatars/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.user.updateAvatar(user, avatar);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.ChatModerator]))
    @Patch('update-tagline')
    async updateTagline(@User() user: JwtPayload, @Body() tagline: UpdateTaglineDTO) {
        return await this.user.updateTagline(user, tagline);
    }
}
