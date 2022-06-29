import chroma from "chroma-js";
import { COLUMNS } from '../../data/columns';
import { writable } from 'svelte/store';
import { _lang } from '$lib/services/store';

const _count = COLUMNS.length;

export const _langFonts = [
    "'Noto Sans Sinhala', sans-serif",
    "'Open Sans', sans-serif",
    "'Mukta Malar', sans-serif"
];
export const _langFontSize = [
    12,
    13,
    13
];

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