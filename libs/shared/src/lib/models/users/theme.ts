export interface Theme {
    /**
     * The website's primary accent color.
     */
    accent: string;

    /**
     * The color used when hovering over an element. Typically a darker sahde
     * of the accent color.
     */
    accentHover: string;

    /**
     * A lighter shade of the accent color.
     */
    accentLight: string;

    /**
     * Background color for pages.
     */
    background: string;

    /**
     * Color used for text.
     */
    textColor: string;

    /**
     * Border color for divs and containers.
     */
    borders: string;

    /**
     * The background color for any control bars.
     */
    controlsBackground: string;

    /**
     * The background color for code blocks.
     */
    codeBackground: string;
}

export const Crimson: Theme = {
    accent: '#DD4C4F',
    accentHover: '#933235',
    accentLight: '#EA7C7C',
    background: '#FBFBFB',
    textColor: '#000000', // aka black
    borders: '#808080', // aka grey
    controlsBackground: '#D3D3D3', // aka lightgrey
    codeBackground: '#F0F0F0',
};

export const DarkCrimson: Theme = {
    accent: '#DD4C4F',
    accentHover: '#933235',
    accentLight: '#E58E8E',
    background: '#272727',
    textColor: '#F5F5F5', // aka WhiteSmoke
    borders: '#FFFFFF', // aka White
    controlsBackground: '#3A3A3A',
    codeBackground: '#3A3A3A',
};

export const Aqua: Theme = {
    accent: '#5098D6',
    accentHover: '#316399',
    accentLight: '#A2CDEF',
    background: '#FBFBFB',
    textColor: '#000000', // aka black
    borders: '#808080', // aka gray
    controlsBackground: '#D3D3D3', // aka lightgrey
    codeBackground: '#F0F0F0',
};

export const DarkAqua: Theme = {
    accent: '#5098D6',
    accentHover: '#316399',
    accentLight: '#A2CDEF',
    background: '#272727',
    textColor: '#F5F5F5', // aka whitesmoke
    borders: '#FFFFFF', // aka white
    controlsBackground: '#3A3A3A',
    codeBackground: '#3A3A3A',
};

export const Royal: Theme = {
    accent: '#9A4EAE',
    accentHover: '#4E2A84',
    accentLight: '#C987DB',
    background: '#FBFBFB',
    textColor: '#000000', // aka black
    borders: '#808080', // aka grey
    controlsBackground: '#D3D3D3', // aka lightgrey
    codeBackground: '#F0F0F0',
};

export const DarkRoyal: Theme = {
    accent: '#9A4EAE',
    accentHover: '#4E2A84',
    accentLight: '#C987DB',
    background: '#272727',
    textColor: '#F5F5F5', // aka whitesmoke
    borders: '#FFFFFF', // aka white
    controlsBackground: '#3A3A3A',
    codeBackground: '#3A3A3A',
};

export const Steel: Theme = {
    accent: '#3B3F44',
    accentHover: '#3C8028',
    accentLight: '#8EC67B',
    background: '#FBFBFB',
    textColor: '#000000', // aka black
    borders: '#808080', // aka grey
    controlsBackground: '#D3D3D3', // aka lightgrey
    codeBackground: '#F0F0F0',
};

export const MidnightField: Theme = {
    accent: '#3C8028',
    accentHover: '#3B3F44',
    accentLight: '#8EC67B',
    background: '#272727',
    textColor: '#F5F5F5', //aka whitesmoke
    borders: '#FFFFFF', // aka white
    controlsBackground: '#3A3A3A',
    codeBackground: '#3A3A3A',
};

export const Autumn: Theme = {
    accent: '#D16D2B',
    accentHover: '#AC4731',
    accentLight: '#F69325',
    background: '#FBFBFB',
    textColor: '#000000', //aka black
    borders: '#808080', // aka grey
    controlsBackground: '#D3D3D3', // aka lightgrey
    codeBackground: '#F0F0F0',
};

export const DuskAutumn: Theme = {
    accent: '#D16D2B',
    accentHover: '#AC4731',
    accentLight: '#F69325',
    background: '#272727',
    textColor: '#F5F5F5', // aka whitesmoke
    borders: '#FFFFFF', // aka white
    controlsBackground: '#3A3A3A',
    codeBackground: '#3A3A3A',
};

export const PredefinedThemes: Record<string, Theme> = {
    crimson: Crimson,
    'dark-crimson': DarkCrimson,
    aqua: Aqua,
    'dark-aqua': DarkAqua,
    royal: Royal,
    'dark-royal': DarkRoyal,
    steel: Steel,
    'midnight-field': MidnightField,
    autumn: Autumn,
    'dusk-autumn': DuskAutumn,
};
