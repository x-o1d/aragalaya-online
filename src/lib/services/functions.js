import { app } from '$lib/config/firebase-config';
import { _environment } from '$lib/config/environment';

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app);

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _createPost = async (post) => {
    post._environment = _environment;
    return httpsCallable(functions, 'addpost')(post);
}