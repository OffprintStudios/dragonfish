import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PseudonymDocument } from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { PseudonymForm, ChangeUserTag, ChangeScreenName } from '@dragonfish/shared/models/accounts';
import { User } from '@dragonfish/shared/models/users';
import { chain } from 'voca';
import { Logger } from '@nestjs/common/services/logger.service';

@Injectable()
export class PseudonymsStore {
    constructor(@InjectModel('Pseudonym') private readonly pseudModel: Model<PseudonymDocument>) {}

    //#region ---FETCH PSEUDONYMS---

    public async fetchPseud(id: string): Promise<PseudonymDocument> {
        return this.retrievePseud(id);
    }

    //#endregion

    //#region ---CRUD OPERATIONS---

    public async createPseud(user: JwtPayload, formInfo: PseudonymForm) {
        const newPseud = new this.pseudModel({
            accountId: user.sub,
            userTag: formInfo.userTag,
            screenName: formInfo.screenName,
            'profile.pronouns': formInfo.pronouns,
            roles: user.roles,
        });

        return newPseud.save(function (err) {
            if (err.errors.userTag) {
                throw new BadRequestException('This user tag is already taken.');
            }
        });
    }

    public async changeUserTag(pseudId: string, formInfo: ChangeUserTag) {
        const pseud = await this.retrievePseud(pseudId);

        pseud.userTag = formInfo.newUserTag;
        return await pseud.save();
    }

    public async changeScreenName(pseudId: string, formInfo: ChangeScreenName) {
        const pseud = await this.retrievePseud(pseudId);

        pseud.screenName = formInfo.newScreenName;
        return await pseud.save();
    }

    //#endregion

    //#region ---ACCOUNT MIGRATION (DELETE AFTER ACCOUNTS HAVE BEEN MIGRATED)---

    public async migrateAccount(user: User, accountId: string) {
        const newUserTag = chain(user.username).latinise().replace(' ', '').value();
        const pseud = new this.pseudModel({
            _id: user._id,
            accountId: accountId,
            userTag: newUserTag,
            screenName: user.username,
            'profile.avatar': user.profile.avatar,
            'profile.bio': user.profile.bio,
            'profile.tagline': user.profile.tagline,
            'profile.coverPic': user.profile.coverPic,
            'stats.works': user.stats.works,
            'stats.blogs': user.stats.blogs,
            'stats.followers': user.stats.watchers,
            'stats.following': user.stats.watching,
            roles: user.audit.roles,
            createdAt: user.createdAt,
        });

        return await pseud.save();
    }

    //#endregion

    //#region ---PRIVATE---

    private async retrievePseud(id: string): Promise<PseudonymDocument> {
        const pseud = await this.pseudModel.findById(id);

        if (isNullOrUndefined(pseud)) {
            throw new NotFoundException(`This user doesn't seem to exist.`);
        }

        return pseud;
    }

    //#endregion
}
