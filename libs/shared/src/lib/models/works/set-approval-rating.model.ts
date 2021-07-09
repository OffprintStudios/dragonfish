import { RatingOption } from '../reading-history';

export interface SetApprovalRating {
    readonly workId: string;
    readonly oldApprovalRating: RatingOption;
}
