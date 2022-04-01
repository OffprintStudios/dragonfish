import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AccountsStore, PseudonymsStore } from '../db/stores';
import {
    ChangeBio,
    ChangeScreenName,
    ChangeTagline,
    Pseudonym,
    Roles,
} from '$shared/models/accounts';
import { isAllowed, JwtPayload } from '$shared/auth';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        private readonly pseudStore: PseudonymsStore,
        private readonly accounts: AccountsStore,
    ) {}

    async getOneUser(userId: string): Promise<Pseudonym> {
        return await this.pseudStore.fetchPseud(userId);
    }

    async changeScreenName(userId: string, screenNameForm: ChangeScreenName): Promise<Pseudonym> {
        if (screenNameForm.newScreenName.length > 32 || screenNameForm.newScreenName.length < 3) {
            throw new BadRequestException(
                `Your screen name must be longer than 3 characters, but shorter than 32.`,
            );
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

    async updateTagline(
        token: JwtPayload,
        userId: string,
        newTagline: ChangeTagline,
    ): Promise<Pseudonym> {
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

    async updateCounts(userId: string, blogNum: number, workNum: number) {
        await this.pseudStore.updateBlogCount(userId, blogNum);
        await this.pseudStore.updateWorkCount(userId, workNum);
    }

    async createInviteCode() {
        return await this.accounts.createInviteCode();
    }
}
