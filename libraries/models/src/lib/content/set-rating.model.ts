import { RatingOption } from '../reading-history';

export interface SetRating {
    readonly workId: string;
    readonly oldApprovalRating: RatingOption;
}
