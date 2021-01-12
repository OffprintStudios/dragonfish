import { Component, Input, OnInit } from '@angular/core';
import * as lodash from 'lodash';
import { Roles } from '@pulp-fiction/models/users';

@Component({
    selector: 'role-badge',
    templateUrl: './role-badge.component.html',
    styleUrls: ['./role-badge.component.less']
})
export class RoleBadgeComponent implements OnInit {
    @Input() roles: Roles[];

    constructor() {}

    ngOnInit(): void {}

    /**
     * Checks to see what the prominent role for this user is so it can be displayed.
     * 
     * @param roles The roles to check
     */
    determineProminentRole() {
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
}