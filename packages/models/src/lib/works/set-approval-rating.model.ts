import { RatingOption } from '../history';

export interface SetApprovalRating {
    readonly workId: string;
    readonly oldApprovalRating: RatingOption;
}