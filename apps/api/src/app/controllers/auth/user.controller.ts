import {
    Controller,
    UseGuards,
    Patch,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { IdentityGuard } from '../../guards';
import { IImages } from '../../shared/images';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ContentFilter } from '@dragonfish/shared/models/content';
import { UserService } from '../../services/auth/user.service';
import { ChangeBio, ChangeScreenName, ChangeTagline, Roles } from '@dragonfish/shared/models/accounts';

@Controller('user')
export class UserController {
    constructor(@Inject('IImages') private readonly images: IImages, private readonly user: UserService) {}

    @ApiTags(DragonfishTags.Users)
    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.user.getOneUser(userId);
    }

    @ApiTags(DragonfishTags.Users)
    @Get('get-user-profile')
    async getUserProfile(@Query('userId') userId: string, @Query('filter') filter: ContentFilter) {
        return await this.user.getUserProfile(userId, filter);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(IdentityGuard([Roles.User]))
    @Patch('change-screen-name')
    async changeScreenName(@Query('pseudId') pseudId: string, @Body() formInfo: ChangeScreenName) {
        return await this.user.changeScreenName(pseudId, formInfo);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(IdentityGuard([Roles.User]))
    @Patch('update-bio')
    async updateBio(@Query('pseudId') pseudId: string, @Body() newBio: ChangeBio) {
        return await this.user.updateBio(pseudId, newBio);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(IdentityGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('upload-avatar')
    async uploadAvatar(@UploadedFile() avatarImage: any, @Query('pseudId') pseudId: string) {
        const avatarUrl = await this.images.upload(avatarImage, pseudId, 'avatars');
        const avatar = `${process.env.IMAGES_HOSTNAME}/avatars/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.user.updateAvatar(pseudId, avatar);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(IdentityGuard([Roles.User]))
    @UseInterceptors(FileInterceptor('coverPic'))
    @Post('upload-cover')
    async uploadCover(@UploadedFile() coverImage: any, @Query('pseudId') pseudId: string) {
        const avatarUrl = await this.images.upload(coverImage, pseudId, 'cover-pics');
        const avatar = `${process.env.IMAGES_HOSTNAME}/cover-pics/${avatarUrl.substr(avatarUrl.lastIndexOf('/') + 1)}`;
        return await this.user.updateCoverPic(pseudId, avatar);
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(
        IdentityGuard([
            Roles.Admin,
            Roles.Moderator,
            Roles.ChatModerator,
            Roles.Maintainer,
            Roles.Contributor,
            Roles.WorkApprover,
            Roles.VIP,
        ]),
    )
    @Patch('update-tagline')
    async updateTagline(@User() user: JwtPayload, @Query('pseudId') pseudId: string, @Body() tagline: ChangeTagline) {
        return await this.user.updateTagline(user, pseudId, tagline);
    }
}
