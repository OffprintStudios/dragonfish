export interface Theme {
    /**
     * The website's primary accent color.
     */
    accent: string,

    /**
     * The color used when hovering over an element. Typically a darker sahde
     * of the accent color.
     */
    accentHover: string,

    /**
     * A lighter shade of the accent color.
     */
    accentLight: string,

    /**
     * Background color for pages.
     */
    background: string,

    /**
     * Color used for text.
     */
    textColor: string,

    /**
     * Border color for divs and containers.
     */
    borders: string,

    /**
     * The background color for any control bars.
     */
    controlsBackground: string,

    /**
     * The background color for code blocks.
     */
    codeBackground: string,
}

export namespace Themes {
    export class Crimson implements Theme {
        static readonly key = 'crimson';

        readonly accent = '#DD4C4F';
        readonly accentHover = '#933235';
        readonly accentLight = '#EA7C7C';
        readonly background = '#FBFBFB';
        readonly textColor = '#000000'; // aka black
        readonly borders = '#808080'; // aka grey
        readonly controlsBackground = '#D3D3D3'; // aka lightgrey
        readonly codeBackground = '#F0F0F0';
    }

    export class DarkCrimson implements Theme {
        static readonly key = 'dark-crimson';

        readonly accent = '#DD4C4F';
        readonly accentHover = '#933235';
        readonly accentLight = '#EA7C7C';
        readonly background = '#FBFBFB';
        readonly textColor = '#000000'; // aka black
        readonly borders = '#808080'; // aka grey
        readonly controlsBackground = '#D3D3D3'; // aka lightgrey
        readonly codeBackground = '#F0F0F0';
    }

    export class Aqua implements Theme {
        static readonly key = 'aqua';
        
        readonly accent = '#5098D6';
        readonly accentHover = '#316399';
        readonly accentLight = '#A2CDEF';
        readonly background = '#FBFBFB';
        readonly textColor = '#000000'; // aka black
        readonly borders = '#808080'; // aka gray
        readonly controlsBackground = '#D3D3D3'; // aka lightgrey
        readonly codeBackground = '#F0F0F0';
    }

    export class DarkAqua implements Theme {
        static readonly key = 'dark-aqua';

        readonly accent = '#5098D6';
        readonly accentHover = '#316399';
        readonly accentLight = '#A2CDEF';
        readonly background = '#272727';
        readonly textColor = '#F5F5F5'; // aka whitesmoke
        readonly borders = '#FFFFFF'; // aka white
        readonly controlsBackground = '#3A3A3A';
        readonly codeBackground = '#3A3A3A';
    }

    export class Royal implements Theme {
        static readonly key = 'royal';

        readonly accent = '#9A4EAE';
        readonly accentHover = '#4E2A84';
        readonly accentLight = '#C987DB';
        readonly background = '#FBFBFB';
        readonly textColor = '#000000'; // aka black
        readonly borders = '#808080'; // aka grey
        readonly controlsBackground = '#D3D3D3'; // aka lightgrey
        readonly codeBackground = '#F0F0F0';
    }

    export class DarkRoyal implements Theme {
        static readonly key = 'dark-royal';
        
        readonly accent = '#9A4EAE';
        readonly accentHover = '#4E2A84';
        readonly accentLight = '#C987DB';
        readonly background = '#272727';
        readonly textColor = '#F5F5F5'; // aka whitesmoke
        readonly borders = '#FFFFFF'; // aka white
        readonly controlsBackground = '#3A3A3A';
        readonly codeBackground = '#3A3A3A';
    }

    export class Steel implements Theme {
        static readonly key = 'steel';

        readonly accent = '#3B3F44';
        readonly accentHover = '#3C8028';
        readonly accentLight = '#8EC67B';
        readonly background = '#FBFBFB';
        readonly textColor = '#000000'; // aka black
        readonly borders = '#808080';  // aka grey
        readonly controlsBackground = '#D3D3D3'; // aka lightgrey
        readonly codeBackground = '#F0F0F0';
    }
    
    export class MidnightField implements Theme {
        static readonly key = 'midnight-field';

        readonly accent = '#3C8028';
        readonly accentHover = '#3B3F44';
        readonly accentLight = '#8EC67B';
        readonly background = '#272727';
        readonly textColor = '#F5F5F5'; //aka whitesmoke
        readonly borders = '#FFFFFF'; // aka white
        readonly controlsBackground = '#3A3A3A';
        readonly codeBackground = '#3A3A3A';
    }

    export class Autumn implements Theme {
        static readonly key = 'autumn';

        readonly accent = '#D16D2B';
        readonly accentHover = '#AC4731';
        readonly accentLight = '#F69325';
        readonly background = '#FBFBFB';
        readonly textColor = '#000000'; //aka black
        readonly borders = '#808080'; // aka grey
        readonly controlsBackground = '#D3D3D3'; // aka lightgrey 
        readonly codeBackground = '#F0F0F0';
    }

    export class DuskAutumn implements Theme {
        static readonly key = 'dusk-autumn';

        readonly accent = '#D16D2B';
        readonly accentHover = '#AC4731';
        readonly accentLight = '#F69325';
        readonly background = '#272727';
        readonly textColor = '#F5F5F5'; // aka whitesmoke
        readonly borders = '#FFFFFF'; // aka white
        readonly controlsBackground = '#3A3A3A';
        readonly codeBackground = '#3A3A3A';
    }

    export enum Preference {
        Crimson = 'crimson',
        DarkCrimson = 'dark-crimson',
        Aqua = 'aqua',
        DarkAqua = 'dark-aqua',
        Royal = 'royal',
        DarkRoyal = 'dark-royal',
        Steel = 'steel',
        MidnightField = 'midnight-field',
        Autumn = 'autumn',
        DuskAutumn = 'dusk-autumn'
    }
}

/*
export const PredefinedThemes = Record<string; Theme> = {
    'crimson' = Crimson;
    'dark-crimson' = DarkCrimson;
    'aqua' = Aqua;
    'dark-aqua' = DarkAqua;
    'royal' = Royal;
    'dark-royal' = DarkRoyal;
    'steel' = Steel;
    'midnight-field' = MidnightField;
    'autumn' = Autumn;
    'dusk-autumn' = DuskAutumn
}
*/