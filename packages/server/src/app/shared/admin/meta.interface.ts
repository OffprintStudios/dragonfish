import { FrontPageStats } from '@dragonfish/models/stats';
import { FrontendUser } from '@dragonfish/models/users';

/**
 * ## The Meta Interface
 *
 * Implement this interface to be able to serve data to associated routes.
 */
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
