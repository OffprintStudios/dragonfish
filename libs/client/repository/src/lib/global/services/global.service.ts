import { Injectable } from '@angular/core';
import { ContentFilter } from '@dragonfish/shared/models/content';

@Injectable({
    providedIn: 'root',
})
export class GlobalService {
    /**
     * Sets the contentFilter cookie based on the values of the two provided booleans.
     *
     * @param enableMature Enable mature check
     * @param enableExplicit Enable explicit check
     */
    public setContentFilter(enableMature: boolean, enableExplicit: boolean) {
        let filterSetting: ContentFilter = ContentFilter.Default;

        if (enableMature === true && enableExplicit === false) {
            filterSetting = ContentFilter.MatureEnabled;
        } else if (enableMature === false && enableExplicit === true) {
            filterSetting = ContentFilter.ExplicitEnabled;
        } else if (enableMature === true && enableExplicit === true) {
            filterSetting = ContentFilter.Everything;
        } else if (enableMature === false && enableExplicit === false) {
            filterSetting = ContentFilter.Default;
        }

        return filterSetting;
    }
}
