import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PseudonymDocument } from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { PseudonymForm, ChangeUserTag, ChangeScreenName } from '@dragonfish/shared/models/accounts';
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

        return newPseud.save(function (err) {
            if (err.errors.userTag) {
                throw new BadRequestException('This user tag is already taken.');
            }
        });
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
