import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { BrowseStore } from '@dragonfish/api/database/content/stores';
import { ContentFilter, ContentModel } from '@dragonfish/shared/models/content';
import { PseudonymsStore } from '@dragonfish/api/database/accounts/stores';
import { ChangeBio, ChangeScreenName, ChangeTagline, Pseudonym, Roles } from '@dragonfish/shared/models/accounts';
import { isAllowed } from '@dragonfish/shared/functions';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private readonly pseudStore: PseudonymsStore, private readonly contentStore: BrowseStore) {}

    async getOneUser(userId: string): Promise<Pseudonym> {
        return await this.pseudStore.fetchPseud(userId);
    }

    async getUserProfile(
        userId: string,
        filter: ContentFilter,
    ): Promise<{ works: ContentModel[]; blogs: ContentModel[] }> {
        return await this.contentStore.fetchFirstThreePublished(filter, userId);
    }

    async changeScreenName(userId: string, screenNameForm: ChangeScreenName): Promise<Pseudonym> {
        if (screenNameForm.newScreenName.length > 32 || screenNameForm.newScreenName.length < 3) {
            throw new BadRequestException(`Your screen name must be longer than 3 characters, but shorter than 32.`);
        }
        return await this.pseudStore.changeScreenName(userId, screenNameForm);
    }

    async updateBio(userId: string, bioForm: ChangeBio): Promise<Pseudonym> {
        if (bioForm.bio && bioForm.bio.length > 160) {
            throw new BadRequestException('Your bio must not be longer than 160 characters.');
        }
        return await this.pseudStore.changeBio(userId, bioForm);
    }

    async updateAvatar(userId: string, newAvatarUrl: string): Promise<Pseudonym> {
        return await this.pseudStore.updateAvatar(userId, newAvatarUrl);
    }

    async updateCoverPic(userId: string, coverPicUrl: string): Promise<Pseudonym> {
        return await this.pseudStore.updateCover(userId, coverPicUrl);
    }

    async updateTagline(token: JwtPayload, userId: string, newTagline: ChangeTagline): Promise<Pseudonym> {
        if (
            isAllowed(token.roles as Roles[], [
                Roles.Admin,
                Roles.ChatModerator,
                Roles.Contributor,
                Roles.Moderator,
                Roles.ChatModerator,
                Roles.WorkApprover,
                Roles.VIP,
            ])
        ) {
            return await this.pseudStore.changeTagline(userId, newTagline);
        } else {
            throw new UnauthorizedException(`You don't have permission to do that.`);
        }
    }
}
