import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import { app } from './firebase'

const storage = getStorage(app);

// NOTE: properties exposed from services (export) are prepended with
// a _ so that they can easily be distinguished from component properties

export const _uploadToImages = async (file) => {
    let user = getAuth().currentUser;
    if(user) {
        let name = uuid();
        const storageRef = ref(storage, 'images/'+ name);

        await uploadBytes(storageRef, file);

        return {
            url: '/images/'+ name,
            name: file.name,
            createdBy: user.uid,
            createdByName: user.name || '',
            createdOn: (new Date()).getTime()
        }
    } else {
        console.log('image upload failed: user not signed in');
        return undefined;
    }
}

export const _uploadToProposals = async (file) => {
    let user = getAuth().currentUser;

    if(user) {
        let name = uuid();
        const storageRef = ref(storage, 'proposals/'+ name);

        await uploadBytes(storageRef, file);

        return {
            url: '/proposals/'+ name,
            name: file.name,
            createdBy: user.uid,
            createdByName: user.name || '',
            createdOn: (new Date()).getTime()
        };
    } else {
        console.log('file upload failed: user not signed in');
        return undefined;
    }
}

export const _getFileURL = async (url) => {
    return getDownloadURL(ref(storage, url));
}