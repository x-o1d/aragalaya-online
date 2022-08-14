import { app } from '$lib/config/firebase-config';

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app);

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _createPost = async (post) => {
    return httpsCallable(functions, 'addpost')(post);
}

export const _adminGetUser = async (email) => {
    return httpsCallable(functions, 'admingetuser')(email);
}

export const _adminChangeRole = async (uid, role) => {
    return httpsCallable(functions, 'adminchangerole')({uid, role});
}