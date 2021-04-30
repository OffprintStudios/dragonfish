import {
    Controller,
    UseGuards,
    Patch,
    Get,
    Post,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Roles, FrontendUser } from '@dragonfish/shared/models/users';
import { RolesGuard } from '../../guards';
import { ChangeEmailDTO, ChangePasswordDTO, ChangeBioDTO, ChangeUsernameDTO, UpdateTaglineDTO } from './models';
import { IUser } from '../../shared/auth';
import { IImages } from '../../shared/images';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';

@Controller('user')
export class UserController {
    constructor(@Inject('IUser') private readonly user: IUser, @Inject('IImages') private readonly images: IImages) {}

    @ApiTags(DragonfishTags.Users)
    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.user.getOneUser(userId);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-email')
    async changeEmail(@User() user: JwtPayload, @Body() changeEmailRequest: ChangeEmailDTO) {
        return await this.user.changeEmail(user, changeEmailRequest);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-username')
    async changeUsername(@User() user: JwtPayload, @Body() changeUsernameRequest: ChangeUsernameDTO) {
        // TODO: Determine how we want to handle this.
        // We should decide what--and if we need--restrictions to have around name changes.
        //return await this.user.changeUsername(user, changeUsernameRequest);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-password')
    async changePassword(@User() user: JwtPayload, @Body() newPassword: ChangePasswordDTO) {
        return await this.user.changePassword(user, newPassword);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('update-bio')
    async updateBio(@User() user: JwtPayload, @Body() newBio: ChangeBioDTO) {
        if (newBio.bio && newBio.bio.length > 160) {
            throw new BadRequestException('Your bio must not be longer than 160 characters.');
        }
        return await this.user.updateBio(user, newBio);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Post('agree-to-policies')
    async agreeToPolicies(@User() user: JwtPayload): Promise<FrontendUser> {
        return await this.user.agreeToPolicies(user);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: any, @User() user: JwtPayload) {
        const avatarUrl = await this.images.upload(avatarImage, user.sub, 'avatars');
        const avatar = `${process.env.IMAGES_HOSTNAME}/avatars/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.user.updateAvatar(user, avatar);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.ChatModerator]))
    @Patch('update-tagline')
    async updateTagline(@User() user: JwtPayload, @Body() tagline: UpdateTaglineDTO) {
        return await this.user.updateTagline(user, tagline);
    }
}
