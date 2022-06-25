import chroma from "chroma-js";
import { COLUMNS } from '../../data/columns';
import { writable } from 'svelte/store';

export const current = writable(2);

const pallette = [
    ['#E96491', '#574141', '#BFA5A4', '#83982B'],
    ['#2b2b4e', '#777586', '#ABA9BB', '#6D4746'],
    ['#c09c41', '#4D4637', '#B4AA99', '#2CDEC0'],
    ['#299D84', '#354B45', '#98B0A9', '#4992CE'],
    ['#E76F51', '#56423D', '#BEA6A0', '#63A23F'],
    ['#5f0f41', '#a63253', '#bba5b0', '#4c4452']
];

export const themes = pallette.map((_, i) => {
    const contrast = chroma.contrast(_[0],'black');
    let nav = _[0];
    if(contrast < 5) {
        nav = chroma.scale([_[0], 'white'])(0.6).hex()
    }
    return {
        columns: chroma.scale([_[0], _[1]])
        .colors(COLUMNS.length + 2, 'hex'),
        nav,
        background:  chroma.scale([_[2], 'white'])(0.5).hex()
    }
});