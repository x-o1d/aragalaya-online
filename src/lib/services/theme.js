import { COLUMN_COUNT } from '$lib/config/column-config';

import chroma from "chroma-js";
import { writable } from 'svelte/store';

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _isMobile = writable(false);

// START: color configuration

// a font group is a set of fonts in all three languages which can be used
// for a particular text with the <Font> component
// ex: <Font font={0} remSize={1}>text</Font>
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
// each value in a row sets a relative size for a language within a group.
// since english fonts are more standard, the second column of this array 
// should always be fixed at 1.
// column one and two can be adjusted to make the sinhala and tamil fonts 
// within a font group to have a similar display height.
export const _fontSizes = [
    [1.2, 1, 0.85],
    [0.8, 1, 1.0],
    [0.9, 1, 1.0],
    [1.0, 1, 1.0],
];

// each element in the pallette specifies a set of colors to be used in
// a theme
// first element (index 0) is the default theme
const pallettes = [
    ['#274654', '#299d8f', '#e9c46a', '#f4a261', '#e76f51'],
    ['#9A031A', '#e26413', '#fb8b24', '#0f4C5C', '#5f0f41'],
    ['#E63A46', '#e12f7d', '#bf47af', '#7f63d1', '#0076dc'],
    ['#E96491', '#bd629f', '#8b629f', '#5d5e90', '#3c5576'],
    ['#fffe00', '#85e757', '#00c484', '#009b95', '#007184'],
    ['#6f3cb1', '#ca369c', '#ff537c', '#ff885f', '#ffc154'],
];

// column header font color
const _headerFontColor = '#ffffff'

const _previewOpacity = '0.3';

// END: - color configuration

// _themes contains a theme object per pallette item.
// it constructs various color options based on the
// colors specified in the pallette.
//
// current theme colors are available as css properties throughout
// the app. (set in __layout.svelte line 25)
// NOTATION: --theme-[propertyName.toLowerCase()]-[index]
//
// EXAMPLES:
// headerBackground -> var(--theme-headerbackground)
// columns[0] -> var(--theme-columns-0)
// navigation[6] -> var(--theme-navigation-6)
export const _themes = pallettes.map((pallette, i) => { 

    // convert the pallette colors to an lch scale
    // to get (n+2) number of equispaced colors, where
    // n = number of columns
    // the additional two colors are for the padding at
    // the start and end of columns
    const columns = chroma.scale(pallette).mode('lch')
        .colors(COLUMN_COUNT + 2, 'hex');

    // navigation bar is black, in order for the icons 
    // to maintain contrast the column colors are reduced to 
    // 30% luminance 
    const navigation = columns.map((c, _i) => {
        return chroma(c).luminance(0.3).hex()
    });

    // header background color
    const headerBackground = 'white';

    // column backgoundcolor
    const columnBackground = chroma.scale(['black', 'white'])(0.92).hex();

    // alternate column background color
    const columnBackgroundAlternate = chroma.scale(['black', 'white'])(0.86).hex();

    // default button color
    const defaultButton =  navigation[0];

    // cancel button color
    const cancelButton =  navigation[1];

    // column header font color
    // currently not theme specific
    const headerFontColor = _headerFontColor;

    const previewOpacity = _previewOpacity;
    
    return { columns, navigation, headerBackground, columnBackground, columnBackgroundAlternate,
        defaultButton, cancelButton, headerFontColor, previewOpacity };
});

// START: size configuration

// layout header height
const layoutHeaderHeight = 50

// width of a column in the layout in a desktop browser
// in mobile it would revert to 100% viewport width
const columnWidth = 500;

// column header height
const columnHeaderHeight = 50;

// separation of the cards in columns:
// this property sets the perceived separation of cards in the column layout
// in a desktop browser in pixels.s
// NOTE:: in a mobile browser it should be half because only a single
// column is visible
const cardSeparation = 12;

// padding inside a card
const cardPadding = cardSeparation;

// navigation button size
const navSize = 60;

// previewHeight (maintain 16:9 aspect ratio)
const previewHeight = (columnWidth-cardSeparation-cardPadding*2)*9/16;

// toolbar button size
const toolbarButtonSize = 20;

// NOTE:: make sure _getSizeConfig is called from inside an onMount() hook
// window isn't available for SSR
export const _getSizeConfig = () => {

    let devicePixelRatio = (window && window.innerWidth > 600)
        ? window.devicePixelRatio: 1;

    // initialize temporary variables for sizes that are scaled for mobile
    let _columnWidth = columnWidth;
    let _previewHeight = previewHeight;
    let _navSize = navSize;
    let _toolbarButtonSize = toolbarButtonSize;

    // scale sizes for mobile screens if screen width is smaller than 600px
    if(window && (window.innerWidth < 600)) {
        // set the _isMobile store to true
        _isMobile.set(true);

        _columnWidth = window.innerWidth;
        _previewHeight = (_columnWidth-cardSeparation-cardPadding*2)*9/16;
        _navSize = 50;
        _toolbarButtonSize = 26;
    }

    // these parameters are automatically added as css variables in __layout.svelte
    // ex: --theme-layoutheaderheight
    return {
        layoutHeaderHeight: layoutHeaderHeight/devicePixelRatio,
        columnWidth: _columnWidth/devicePixelRatio,
        columnHeaderHeight: columnHeaderHeight/devicePixelRatio,
        cardSeparation: cardSeparation/devicePixelRatio,
        // card seperation half is added because it is typically used as a padding
        // to achieve the specified card seperation
        cardSeparationHalf: cardSeparation/2/devicePixelRatio,
        cardSeparationQuarter: cardSeparation/4/devicePixelRatio,
        cardPadding: cardPadding/devicePixelRatio,
        previewHeight: _previewHeight/devicePixelRatio,
        navSize: _navSize/devicePixelRatio,
        navIconSize: _navSize/3/devicePixelRatio,
        toolbarButtonSize: _toolbarButtonSize/devicePixelRatio,
    }
}

// END: size configuration
