import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PseudonymDocument } from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    PseudonymForm,
    ChangeUserTag,
    ChangeScreenName,
    ChangeBio,
    ChangeTagline,
    ChangePronouns,
} from '@dragonfish/shared/models/accounts';
import { chain } from 'voca';

@Injectable()
export class PseudonymsStore {
    constructor(@InjectModel('Pseudonym') private readonly pseudModel: Model<PseudonymDocument>) {}

    //#region ---FETCH PSEUDONYMS---

    public async fetchPseud(id: string): Promise<PseudonymDocument> {
        return this.retrievePseud(id);
    }

    //#endregion

    //#region ---CRUD OPERATIONS---

    public async createPseud(user: JwtPayload, formInfo: PseudonymForm): Promise<PseudonymDocument> {
        const newPseud = new this.pseudModel({
            accountId: user.sub,
            userTag: chain(formInfo.userTag).latinise().replace(' ', '').value(),
            screenName: formInfo.screenName,
            'profile.pronouns': formInfo.pronouns,
            roles: user.roles,
        });

        return await newPseud.save();
    }

    public async changeUserTag(pseudId: string, formInfo: ChangeUserTag): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);

        pseud.userTag = chain(formInfo.newUserTag).latinise().replace(' ', '').value();
        return await pseud.save();
    }

    public async changeScreenName(pseudId: string, formInfo: ChangeScreenName): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);

        pseud.screenName = formInfo.newScreenName;
        return await pseud.save();
    }

    public async changeBio(pseudId: string, formInfo: ChangeBio): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);

        pseud.profile.bio = formInfo.bio;
        return await pseud.save();
    }

    public async changeTagline(pseudId: string, formInfo: ChangeTagline): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);

        pseud.profile.tagline = formInfo.tagline;
        return await pseud.save();
    }

    public async changePronouns(pseudId: string, formInfo: ChangePronouns): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);
        pseud.profile.pronouns = formInfo.pronouns;
        return await pseud.save();
    }

    public async updateAvatar(pseudId: string, avatarUrl: string): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);
        pseud.profile.avatar = avatarUrl;
        return await pseud.save();
    }

    public async updateCover(pseudId: string, coverUrl: string): Promise<PseudonymDocument> {
        const pseud = await this.retrievePseud(pseudId);
        pseud.profile.coverPic = coverUrl;
        return await pseud.save();
    }

    //#endregion

    //#region ---PRIVATE---

    private async retrievePseud(id: string): Promise<PseudonymDocument> {
        const pseud = await this.pseudModel.findById(id).select('-accountId');

        if (isNullOrUndefined(pseud)) {
            throw new NotFoundException(`This user doesn't seem to exist.`);
        }

        return pseud;
    }

    //#endregion
}
