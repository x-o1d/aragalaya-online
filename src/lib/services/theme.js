import { COLUMN_COUNT } from '$lib/config/columns-config';

import chroma from "chroma-js";
import { writable } from 'svelte/store';

import { _lang } from '$lib/services/store';

// NOTE: properties exposed from services (export) are prepended with
// an _ so that they can easily be distinguished from component properties

// ** style configuration

// a font group is a set of fonts in all three languages which can be used
// for a particular text with the <Font> component
// ex: <Font group={0} remSize={1}>text</Font>
// any text that doesn't use a <Font> component will automatically use the
// first font group
export const _fontGroups = [
    [   // 0 - default font group if a Font component is not used
        // can be used for block texts, buttons, etc..
        "'Abhaya Libre', serif", // si
        "'Nunito', sans-serif", // en
        "'Hind Madurai', sans-serif" // ta
    ],[ // 1 - can be used for titles
        "'Noto Serif Sinhala', serif", // si
        "'Source Sans Pro', sans-serif", // en
        "'Pavanam', sans-serif" // ta
    ],[ // 2 - fonts used in header columns
        "'Noto Sans Sinhala', sans-serif", // si
        "'Open Sans', sans-serif", // en
        "'Mukta Malar', sans-serif" // ta
    ],[ // 3 - used for text elements where language can't be determined
        // roboto can render all three languages in unicode (some of the above fonts can't)
        // example: user names
        "'Roboto', sans-serif", // si
        "'Roboto', sans-serif", // en
        "'Roboto', sans-serif" // ta
    ]
];


// different fonts for the three languages doesn't always 
// have the same perceived height for the same pixel value.
// each value in a row sets a relative size for a language within a group
// the default value is 16.
// within the code the value is speified in rem, typically between 0.9rem 1.5rem (titles)
export const _fontSizes = [
    [15, 13, 13],
    [11, 13, 13],
    [12, 13, 13],
    [12, 12, 12],
];

// each element in the pallette specifies a set of colors to be used in
// a theme
const pallettes = [
    ['#9A031A', '#e26413', '#fb8b24', '#0f4C5C', '#5f0f41'],
    ['#E63A46', '#e12f7d', '#bf47af', '#7f63d1', '#0076dc'],
    ['#274654', '#299d8f', '#e9c46a', '#f4a261', '#e76f51'],
    ['#E96491', '#bd629f', '#8b629f', '#5d5e90', '#3c5576'],
    ['#fffe00', '#85e757', '#00c484', '#009b95', '#007184'],
    ['#6f3cb1', '#ca369c', '#ff537c', '#ff885f', '#ffc154'],
];

// ** END - style configuration

// _current variable holds the current theme index
export const _current = writable(2); 

// themes contains a theme object per pallette item
// it constructs various color options based on the colors
// colors specified in the pallette
// the current theme object can be referred inside components using
// import { _themes, _current } from '$lib/services/theme';
// let currentTheme = themes[$current];
export const _themes = pallettes.map((pallette, i) => { 

    // convert the pallette colors to an lch scale
    // to get (n+2) number of equispaced colors, where
    // n = number of columns
    // the additional two colors are for the padding at
    // the start and end of columns
    let columns = chroma.scale(pallette).mode('lch')
        .colors(COLUMN_COUNT + 2, 'hex');

    // navigation bar is black, in order for the icons 
    // to maintain contrast the column colors are reduced to 
    // 30% luminance 
    let navigation = columns.map((c, _i) => {
        return chroma(c).luminance(0.3).hex()
    });

    // header background color
    let headerBackground = chroma.scale(['black', 'white'])(0.86).hex();

    // column backgoundcolor
    let columnBackground = chroma.scale(['black', 'white'])(0.92).hex();

    // default button color
    let defaultButton =  navigation[0];

    // cancel button color
    let cancelButton =  navigation[1];
    
    return { columns, navigation, headerBackground, columnBackground, defaultButton, cancelButton };
});