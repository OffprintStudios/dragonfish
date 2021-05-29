import { ReportReason } from '@dragonfish/shared/models/case-files/report-kind.enum';

export interface Report {
    readonly _id: number;
    readonly user: string;
    reasons: ReportReason[]; // required
    body: string; // required
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
