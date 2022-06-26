import chroma from "chroma-js";
import { COLUMNS } from '../../data/columns';
import { writable } from 'svelte/store';
import { _lang } from '$lib/services/store';

export const _langFonts = [
    "'Abhaya Libre', serif",
    "'Open Sans', sans-serif",
    "'Mukta Malar', sans-serif"
];
export const _langFontSize = [
    17,
    13,
    13
];

const pallette = [
    {
        header: ['#9A031A', '#fb8b24', '#e26413', '#0f4C5C', '#5f0f41'],
        light: '#c9ada7',
        dark: '#4c4452'
    }, {
        header: ['#E63A46', '#1E3557', '#7ec8cb', '#457b9d', '#275757'],
        light: '#BEA6A0',
        dark: '#63A23F'
    }, {
        header: ['#274654', '#299d8f', '#e9c46a', '#f4a261', '#e76f51'],
        light: '#bba5b0',
        dark: '#4c4452'
    }, {
        header: ['#E96491', '#574141'],
        light: '#BFA5A4',
        dark: '#83982B'
    }, {
        header: ['#2b2b4e', '#777586'],
        light: '#ABA9BB',
        dark: '#6D4746'
    }, {
        header: ['#c09c41', '#a8aa1a'],
        light: '#B4AA99',
        dark: '#2CDEC0'
    }, {
        header: ['#299D84', '#354B45'],
        light: '#98B0A9',
        dark: '#4992CE'
    }
];

export const current = writable(2); // current theme

export const themes = pallette.map((_, i) => {

    let columns = chroma.scale(_.header).mode('lch')
                        .colors(COLUMNS.length + 2, 'hex');

    columns = columns.map(c => {
        if(chroma().contrast(c, 'white') < 5) {
            return chroma(c).darken(1.5).hex();
        }
        return c;
    });

    const nav = columns.map((c, _i) => {
        return chroma(c).luminance(0.3).hex();
    });

    const background = chroma.scale([_.light, 'white'])(0.5).hex();

    return {
        columns,
        nav,
        background
    }
});