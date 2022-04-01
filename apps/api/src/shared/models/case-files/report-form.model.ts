import { ReportReason } from './report-kind.enum';

export interface ReportForm {
    readonly reasons: ReportReason[];
    readonly body: string;
}
