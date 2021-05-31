import { ReportReason } from './report-kind.enum';

export interface Report {
    readonly _id: string;
    readonly user: string;
    reasons: ReportReason[]; // required
    body: string; // required
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
