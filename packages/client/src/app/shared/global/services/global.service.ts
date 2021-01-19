import { Injectable } from '@angular/core';
import { CookieService, CookieOptions } from 'ngx-cookie';

import { ContentFilter } from '@pulp-fiction/models/content';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor (private cookies: CookieService) {}

    /**
     * Sets the contentFilter cookie based on the values of the two provided booleans.
     * 
     * @param enableMature Enable mature check
     * @param enableExplicit Enable explicit check
     */
    public async setContentFilter(enableMature: boolean, enableExplicit: boolean) {
        let options: CookieOptions = {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))};
        let filterSetting: ContentFilter = ContentFilter.Default;

        if (enableMature === true && enableExplicit === false) {
            this.cookies.put('contentFilter', ContentFilter.MatureEnabled, options);
            filterSetting = ContentFilter.MatureEnabled;
        } else if (enableMature === false && enableExplicit === true) {
            this.cookies.put('contentFilter', ContentFilter.ExplicitEnabled, options);
            filterSetting = ContentFilter.ExplicitEnabled;
        } else if (enableMature === true && enableExplicit === true) {
            this.cookies.put('contentFilter', ContentFilter.Everything, options);
            filterSetting = ContentFilter.Everything;
        } else if (enableMature === false && enableExplicit === false) {
            this.cookies.put('contentFilter', ContentFilter.Default, options);
            filterSetting = ContentFilter.Default;
        }

        return filterSetting;
    }
}