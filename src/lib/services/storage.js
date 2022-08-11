import { app } from '$lib/config/firebase-config'

import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuid } from 'uuid';

import { _createError } from '$lib/services/database';
import { _userSignedIn } from '$lib/services/auth';

const storage = getStorage(app);

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _uploadToImages = async (file) => {
    try {
        let user = _userSignedIn();
        if(!user) throw ('user not signed in');
        // replace the actual file name with a uuid
        let name = uuid();
        // upload to firebase storage
        const storageRef = ref(storage, 'images/'+ name);
        let result = await uploadBytes(storageRef, file);

        return {
            url: '/images/'+ result.metadata.name,
            name: file.name,
            type: result.metadata.contentType,
            createdBy: user.uid,
            createdByName: user.name,
            createdOn: (new Date()).getTime()
        }
    } catch (error) {
        _createError(error, 'storageService::_uploadToImages', file);
    }    
}

export const _uploadToDocuments = async (file) => {
    try {
        let user = _userSignedIn();
        if(!user) throw ('user not signed in');

        let name = uuid();
        const storageRef = ref(storage, 'documents/'+ name);

        await uploadBytes(storageRef, file);

        return {
            url: '/documents/'+ name,
            name: file.name,
            createdBy: user.uid,
            createdByName: user.name,
            createdOn: (new Date()).getTime()
        }
    } catch (error) {
        _createError(error, 'storageService::_uploadToDocuments');
    }
}

export const _getFileURL = async (url) => {
    try {
        return getDownloadURL(ref(storage, url));
    } catch (error) {
        _createError(error, 'storageService::_getFileURL');
    }   
}