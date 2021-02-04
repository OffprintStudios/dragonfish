import { intersection } from 'lodash';
import { Roles } from '@dragonfish/models/users';

export function isAllowed(requestRoles: Roles[], requiredRoles: Roles[]) {
    const hasRoles: Roles[] = intersection(requestRoles, requiredRoles);

    if (hasRoles.length === 0) {
        return false;
    } else {
        return true;
    }
}
