import { ReportReason } from '@dragonfish/shared/models/case-files/report-kind.enum';

export interface ReportForm {
    readonly reasons: ReportReason[];
    readonly body: string;
}
