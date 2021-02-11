import { Routes } from '@angular/router';

import { TosComponent } from './tos/tos.component';
import { OmnibusComponent } from './omnibus/omnibus.component';
import { CodeOfConductComponent } from './code-of-conduct/code-of-conduct.component';
import { AboutOffprintComponent } from './about-offprint/about-offprint.component';
import { SiteStaffComponent } from './site-staff/site-staff.component';
import { SupportersComponent } from './supporters/supporters.component';

import { SiteStaffResolver, SupportersResolver } from '../../resolvers/docs';

export const DocsPages = [
    TosComponent,
    OmnibusComponent,
    CodeOfConductComponent,
    AboutOffprintComponent,
    SiteStaffComponent,
    SupportersComponent,
];

export const DocsRoutes: Routes = [
    { path: 'terms-of-service', component: TosComponent },
    { path: 'omnibus', component: OmnibusComponent },
    { path: 'what-is-offprint', component: AboutOffprintComponent },
    { path: 'code-of-conduct', component: CodeOfConductComponent },
    {
        path: 'site-staff',
        component: SiteStaffComponent,
        resolve: {
            staffData: SiteStaffResolver,
        },
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'supporters',
        component: SupportersComponent,
        resolve: {
            supporterData: SupportersResolver,
        },
        runGuardsAndResolvers: 'always',
    },
];
