import { writable } from "svelte/store";

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _lang = writable(0);
export const _themeColorsReady = writable(false);
export const _themeSizesReady = writable(false);
export const _scaledPixelsReady = writable(false);
export const _appContentReady = writable(false);