import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Theme, Themes } from '../../../models/site';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    private wrapper = document.querySelector('html');

    constructor () {}

    public async changeTheme(pref: Themes.Preference): Promise<void> {
        switch (pref) {
            case Themes.Preference.Crimson: await this.setThemeValues(new Themes.Crimson);
            case Themes.Preference.DarkCrimson: await this.setThemeValues(new Themes.DarkCrimson);
            case Themes.Preference.Aqua: await this.setThemeValues(new Themes.Aqua);
            case Themes.Preference.DarkAqua: await this.setThemeValues(new Themes.DarkAqua);
            case Themes.Preference.Royal: await this.setThemeValues(new Themes.Royal);
            case Themes.Preference.DarkRoyal: await this.setThemeValues(new Themes.DarkRoyal);
            case Themes.Preference.Steel: await this.setThemeValues(new Themes.Steel);
            case Themes.Preference.MidnightField: await this.setThemeValues(new Themes.MidnightField);
            case Themes.Preference.Autumn: await this.setThemeValues(new Themes.Autumn);
            case Themes.Preference.DuskAutumn: await this.setThemeValues(new Themes.DuskAutumn);
            default: this.setThemeValues(new Themes.Crimson);
        }
    }

    private async setThemeValues(newTheme: Theme): Promise<void> {
        this.wrapper.style.setProperty('--site-accent', newTheme.accent);
        this.wrapper.style.setProperty('--site-accent-hover', newTheme.accentHover);
        this.wrapper.style.setProperty('--site-accent-light', newTheme.accentLight);
        this.wrapper.style.setProperty('--site-background', newTheme.background);
        this.wrapper.style.setProperty('--site-text-color', newTheme.textColor);
        this.wrapper.style.setProperty('--site-borders', newTheme.borders);
        this.wrapper.style.setProperty('--site-controls-background', newTheme.controlsBackground);
        this.wrapper.style.setProperty('--site-code-background', newTheme.codeBackground);
    }
}