import { intersection } from 'lodash';
import { Roles } from '$shared/models/accounts';

export function isAllowed(requestRoles: Roles[], requiredRoles: Roles[]) {
    const hasRoles: Roles[] = intersection(requestRoles, requiredRoles);

    return hasRoles.length !== 0;
}
