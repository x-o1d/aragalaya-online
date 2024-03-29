import { writable } from "svelte/store";
import { v4 as uuid } from 'uuid';

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

// dynamic user variables
export const _lang = writable(0);
export const _currentTheme = writable(undefined);
export const _user = writable(undefined);
export const _admin = writable(false);
export const _verified = writable(false);
export const _anonymousId = 'anon-' + uuid();

// stores used by the Loader component
export const _themeColorsReady = writable(false);
export const _themeSizesReady = writable(false);
export const _scaledPixelsReady = writable(false);
export const _appContentReady = writable(false);
export const _authStateChecked = writable(false);
export const _redirected = writable(false);
export const _signUpInProgress = writable(false);


export const _shareURL = (import.meta.env.MODE == 'prod')? 'https%3A%2F%2Faragalaya.online%2F%3Fpost%3D': 'https%3A%2F%2Faragalaya-online.web.app%2F%3Fpost%3D';
export const _shareLink = (import.meta.env.MODE == 'prod')? 'https://aragalaya.online/?post=': 'https://aragalaya-online.web.app/?post=';
export const _URL = (import.meta.env.MODE == 'prod')? 'https://aragalaya.online': 'https://aragalaya-online.web.app';
