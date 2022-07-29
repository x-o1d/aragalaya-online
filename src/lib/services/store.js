import { writable } from "svelte/store";

// NOTE: properties exposed from services (export) are prepended with
// a _ so that they can easily be distinguished from component properties

export const _lang = writable(0);