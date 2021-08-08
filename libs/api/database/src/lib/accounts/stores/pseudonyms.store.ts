import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PseudonymDocument } from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { PseudonymForm } from '@dragonfish/shared/models/accounts';

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
        });

        return newPseud.save(function (err) {
            if (err.errors.userTag) {
                throw new BadRequestException('This user tag is already taken.');
            }
        });
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
