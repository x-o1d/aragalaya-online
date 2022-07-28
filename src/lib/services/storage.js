import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import { app } from './firebase'

const storage = getStorage(app);

export const uploadToImages = async (file) => {
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

export const uploadToProposals = async (file) => {
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

export const getFileURL = async (url) => {
    return getDownloadURL(ref(storage, url));
}