import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { CardSize, ThemePref } from '$lib/models/site';
import { ContentFilter } from '$lib/models/content';

interface AppState {
    isOfAge: boolean;
    filter: ContentFilter;
    theme: ThemePref;
    darkMode: boolean;
    cardSize: CardSize;
    error: {
        title: string;
        desc: string;
    };
}

const defaultAppState: AppState = {
    isOfAge: false,
    filter: ContentFilter.Default,
    theme: ThemePref.Crimson,
    darkMode: false,
    cardSize: CardSize.Medium,
    error: null,
};

const initialAppState: AppState = browser
    ? JSON.parse(window.localStorage.getItem('app')) ?? defaultAppState
    : defaultAppState;
export const app = writable<AppState>(initialAppState);

app.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('app', JSON.stringify(value));
    }
});

export function setTheme(theme: ThemePref): void {
    app.update((state) => ({
        ...state,
        theme,
    }));
}

export function setCardSize(size: CardSize): void {
    app.update((state) => ({
        ...state,
        cardSize: size,
    }));
}

export function setDarkMode(isDark: boolean): void {
    app.update((state) => ({
        ...state,
        darkMode: isDark,
    }));
}

export function setOfAge(): void {
    app.update((state) => ({
        ...state,
        isOfAge: !state.isOfAge,
    }));
}

export function setError(title: string, desc: string): void {
    app.update((state) => ({
        ...state,
        error: { title, desc },
    }));
}

export function setFilter(enableMature: boolean, enableExplicit: boolean): void {
    app.update((state) => ({
        ...state,
        filter: determineContentFilter(enableMature, enableExplicit),
    }));
}

function determineContentFilter(enableMature: boolean, enableExplicit: boolean): ContentFilter {
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
