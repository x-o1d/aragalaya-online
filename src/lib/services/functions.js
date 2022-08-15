import { app } from '$lib/config/firebase-config';

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app);

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _createPost = async (post) => {
    return httpsCallable(functions, 'add_post')(post);
}

export const _adminGetUser = async (email) => {
    return httpsCallable(functions, 'admin_get_user')(email);
}

export const _adminChangeRole = async (uid, role) => {
    return httpsCallable(functions, 'admin_change_role')({uid, role});
}

export const _adminToggleVerified = async (id) => {
    return httpsCallable(functions, 'admin_toggle_verified')(id);
}