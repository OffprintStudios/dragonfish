import { browser } from "$app/env";
import type { RatingFilter } from "#lib/models/util/filters";
import type { Theme, Brightness } from "#lib/models/util/themes";
import { VALID_RATING_FILTER } from "#lib/models/util/filters";
import { VALID_THEMES, VALID_BRIGHTNESS } from "#lib/models/util/themes";
import { getContext, setContext } from "svelte";

export class AppState {
    static key = Symbol('app');

    theme = $state<Theme>('crimson');
    brightness = $state<Brightness>('system');
    showNSFW = $state<boolean>(false);
    unblurNSFW = $state<boolean>(false);
    ratingFilter = $state<RatingFilter>('restricted');

    get compositeTheme(): string {
        if (this.brightness === 'system' && browser) {
            const mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            return `${mode} ${this.theme}`;
        }
        return `${this.brightness} ${this.theme}`;
    }

    get accentColor(): string {
        if (this.theme === 'crimson') return '205, 86, 84';
        if (this.theme === 'aqua') return '98, 150, 209';
        if (this.theme === 'royal') return '145, 82, 169';
        if (this.theme === 'autumn') return '204, 118, 60';
        if (this.theme === 'field') return '79, 126, 53';

        return '205, 86, 84'; // defaults to crimson
    }

    constructor() {
        if (browser) {
            const savedState = localStorage.getItem(AppState.key.toString());
            if (savedState) {
                try {
                    this.update(JSON.parse(savedState));
                } catch (e) {
                    console.error('Failed to parse app state: ', e);
                }
            }

            // set state to localStorage
            $effect(() => {
                const snapshot = {
                    theme: this.theme,
                    brightness: this.brightness,
                    showNSFW: this.showNSFW,
                    unblurNSFW: this.unblurNSFW,
                    ratingFilter: this.ratingFilter
                };
                localStorage.setItem(AppState.key.toString(), JSON.stringify(snapshot));
            });

            // maintain state across tabs
            window.addEventListener('storage', (event) => {
                if (event.key === AppState.key.toString() && event.newValue) {
                    try {
                        const parsedState = JSON.parse(event.newValue);
                        this.update(parsedState);
                    } catch (e) {
                        console.error('Failed to parse app state: ', e);
                    }
                }
            });
        }
    }

    update(state: Partial<AppState>) {
        if (state.theme !== undefined && VALID_THEMES.includes(state.theme)) {
            this.theme = state.theme;
        }
        if (state.brightness !== undefined && VALID_BRIGHTNESS.includes(state.brightness)) {
            this.brightness = state.brightness;
        }
        if (state.showNSFW !== undefined && typeof state.showNSFW === 'boolean') {
            this.showNSFW = state.showNSFW;
        }
        if (state.unblurNSFW !== undefined && typeof state.unblurNSFW === 'boolean') {
            this.unblurNSFW = state.unblurNSFW;
        }
        if (state.ratingFilter !== undefined && VALID_RATING_FILTER.includes(state.ratingFilter)) {
            this.ratingFilter = state.ratingFilter;
        }
    }

    static provideState(): AppState {
        return setContext(AppState.key, new AppState());
    }

    static useState(): AppState {
        return getContext<AppState>(AppState.key);
    }
}
