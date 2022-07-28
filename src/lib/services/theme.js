import chroma from "chroma-js";
import COLUMNS from '$lib/config/columns-config';
import { writable } from 'svelte/store';
import { _lang } from '$lib/services/store';

const _count = COLUMNS.length;

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
const pallette = [
    {
        colors: ['#9A031A', '#e26413', '#fb8b24', '#0f4C5C', '#5f0f41'],
        dark: '#4c4452'
    }, {
        colors: ['#E63A46', '#e12f7d', '#bf47af', '#7f63d1', '#0076dc'],
        dark: '#63A23F'
    }, {
        colors: ['#274654', '#299d8f', '#e9c46a', '#f4a261', '#e76f51'],
        dark: '#4c4452'
    }, {
        colors: ['#E96491', '#bd629f', '#8b629f', '#5d5e90', '#3c5576'],
        dark: '#83982B'
    }, {
        colors: ['#fffe00', '#85e757', '#00c484', '#009b95', '#007184'],
        dark: '#2CDEC0'
    }, {
        colors: ['#6f3cb1', '#ca369c', '#ff537c', '#ff885f', '#ffc154'],
        dark: '#4992CE'
    }
];

// ** END - style configuration

export const current = writable(2); // current theme

export const themes = pallette.map((_, i) => {

    let columns = chroma.scale(_.colors).mode('lch')
                        .colors(_count + 2, 'hex');
    const nav = columns.map((c, _i) => {
        return chroma(c).luminance(0.3).hex();
    });
    const header = chroma.scale(['black', 'white'])
        (0.86).hex();
    const background = chroma.scale(['black', 'white'])
        (0.92).hex();
    const button = nav[0];
    
    return {
        columns,
        nav,
        header,
        background,
        button
    }
});