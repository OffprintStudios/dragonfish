import { FrontPageStats } from '@dragonfish/models/stats';
import { FrontendUser } from '@dragonfish/models/users';

export interface IMeta {
    /**
     * Gets the list of site staff.
     *
     * @returns
     */
    getSiteStaff(): Promise<FrontendUser[]>;

    /**
     * Gets the list of Patreon supporters, VIPs, contributors, and maintainers.
     *
     * @returns
     */
    getSupporters(): Promise<FrontendUser[]>;

    /**
     * Gets the site stats for the footer.
     *
     * @returns
     */
    getPublicStats(): Promise<FrontPageStats>;
}
