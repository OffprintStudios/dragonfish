import {
    Controller,
    UseGuards,
    Patch,
    Post,
    Body,
    UseInterceptors,
    Request,
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

@Controller('user')
export class UserController {
    constructor(@Inject('IUser') private readonly user: IUser, @Inject('IImages') private readonly images: IImages) {}

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-email')
    async changeEmail(@Request() req: any, @Body() changeEmailRequest: ChangeEmailDTO) {
        return await this.user.changeEmail(req.user, changeEmailRequest);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-username')
    async changeUsername(@Request() req: any, @Body() changeUsernameRequest: ChangeUsernameDTO) {
        // TODO: Determine how we want to handle this.
        // We should decide what--and if we need--restrictions to have around name changes.
        //return await this.user.changeUsername(req.user, changeUsernameRequest);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-password')
    async changePassword(@Request() req: any, @Body() newPassword: ChangePasswordDTO) {
        return await this.user.changePassword(req.user, newPassword);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('update-profile')
    async updateProfile(@Request() req: any, @Body() newProfile: ChangeProfileDTO) {
        if (newProfile.bio && newProfile.bio.length > 160) {
            throw new BadRequestException('Your bio must not be longer than 160 characters.');
        }
        return await this.user.updateProfile(req.user, newProfile);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @Post('agree-to-policies')
    async agreeToPolicies(@Request() req: any): Promise<FrontendUser> {
        return await this.user.agreeToPolicies(req.user);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: any, @Request() req: any) {
        const avatarUrl = await this.images.upload(avatarImage, req.user.sub, 'avatars');
        const avatar = `${process.env.IMAGES_HOSTNAME}/avatars/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.user.updateAvatar(req.user, avatar);
    }

    @ApiTags('user')
    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.ChatModerator]))
    @Patch('update-tagline')
    async updateTagline(@Request() req: any, @Body() tagline: UpdateTaglineDTO) {
        return await this.user.updateTagline(req.user, tagline);
    }
}
