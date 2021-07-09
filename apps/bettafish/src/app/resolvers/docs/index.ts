export { SiteStaffResolver } from './site-staff.resolver';
export { SupportersResolver } from './supporters.resolver';

import { SiteStaffResolver } from './site-staff.resolver';
import { SupportersResolver } from './supporters.resolver';

export const DocsResolvers = [SiteStaffResolver, SupportersResolver];
