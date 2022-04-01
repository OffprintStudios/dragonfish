import { RatingOption } from './index';

export interface SetRating {
    readonly workId: string;
    readonly oldApprovalRating: RatingOption;
}
