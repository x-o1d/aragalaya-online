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
        header: ['#9A031A', '#e26413', '#fb8b24', '#0f4C5C', '#5f0f41'],
        light: '#c9ada7',
        dark: '#4c4452'
    }, {
        header: ['#E63A46', '#e12f7d', '#bf47af', '#7f63d1', '#0076dc'],
        light: '#BEA6A0',
        dark: '#63A23F'
    }, {
        header: ['#274654', '#299d8f', '#e9c46a', '#f4a261', '#e76f51'],
        light: '#bba5b0',
        dark: '#4c4452'
    }, {
        header: ['#E96491', '#bd629f', '#8b629f', '#5d5e90', '#3c5576'],
        light: '#BFA5A4',
        dark: '#83982B'
    }, {
        header: ['#fffe00', '#85e757', '#00c484', '#009b95', '#007184'],
        light: '#B4AA99',
        dark: '#2CDEC0'
    }, {
        header: ['#6f3cb1', '#ca369c', '#ff537c', '#ff885f', '#ffc154'],
        light: '#98B0A9',
        dark: '#4992CE'
    }
];

export const current = writable(2); // current theme

export const themes = pallette.map((_, i) => {

    let columns = chroma.scale(_.header).mode('lch')
                        .colors(COLUMNS.length + 2, 'hex');
    const nav = columns.map((c, _i) => {
        return chroma(c).luminance(0.3).hex();
    });
    const background = chroma.scale([_.light, 'white'])(0.5).hex();
    const button = nav[0];

    return {
        columns,
        nav,
        background,
        button
    }
});