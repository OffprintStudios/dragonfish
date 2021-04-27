import { Component, Input } from '@angular/core';
import * as lodash from 'lodash';
import { Roles } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-role-badge',
    templateUrl: './role-badge.component.html',
    styleUrls: ['./role-badge.component.scss'],
})
export class RoleBadgeComponent {
    @Input() roles: Roles[];
    @Input() isCentered: boolean;

    /**
     * Checks to see what the prominent role for this user is so it can be displayed.
     *
     * @param roles The roles to check
     */
    determineProminentRole(): Roles {
        // this will totally need retooling to figure out a much better way to verify what the top-level
        // role is
        const hasAdmin = lodash.intersection([Roles.Admin], this.roles);
        const hasModerator = lodash.intersection([Roles.Moderator], this.roles);
        const hasChatModerator = lodash.intersection([Roles.ChatModerator], this.roles);
        const hasContributor = lodash.intersection([Roles.Contributor], this.roles);
        const hasWorkApprover = lodash.intersection([Roles.WorkApprover], this.roles);
        const hasVIP = lodash.intersection([Roles.VIP], this.roles);
        const hasSupporter = lodash.intersection([Roles.Supporter], this.roles);

        if (hasAdmin.length > 0) {
            return Roles.Admin;
        } else if (hasModerator.length > 0) {
            return Roles.Moderator;
        } else if (hasChatModerator.length > 0) {
            return Roles.ChatModerator;
        } else if (hasContributor.length > 0) {
            return Roles.Contributor;
        } else if (hasWorkApprover.length > 0) {
            return Roles.WorkApprover;
        } else if (hasVIP.length > 0) {
            return Roles.VIP;
        } else if (hasSupporter.length > 0) {
            return Roles.Supporter;
        } else {
            return Roles.User;
        }
    }

    determineCentering() {
        if (this.isCentered === true) {
            return { margin: '0 auto 1.5rem auto' };
        } else {
            return { margin: '0 0 1.5rem 0' };
        }
    }
}
