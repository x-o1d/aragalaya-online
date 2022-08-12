import { app } from '$lib/config/firebase-config';

import { 
    getFirestore,
    where, 
    getDocs, 
    collection, 
    query, 
    orderBy, 
    limit, 
    doc, 
    setDoc, 
    addDoc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import { getAuth } from 'firebase/auth';

const db = getFirestore(app);

import { dev } from '$app/env';

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _createError = async (error, caller, data) => {
    try {
        console.log('Uncaught error in: ',caller);
        console.log('Error: ', error);
        if(data) {
            console.log('Data: ', data);
        }
        if(!dev) {
            await addDoc(collection(db, 'Errors'), {
                message: error.message,
                code: error.code,
                caller: caller,
                signedin: getAuth().currentUser != null,
                time: (new Date()).getTime()
            });
        }
        
    } catch (error) {
        console.log(`Couldn't save error:`, error);
    }
}

export const _getPosts = async (type) => {
    try {
        const c = collection(db, 'Posts');
        const q = query(c, orderBy("createdOn", "desc"), where("type", "==", type), limit(10));
        const qs = await getDocs(q);

        const items = [];
        qs.docs.forEach(doc => {
            if(doc.id !== '0' && doc.exists()) {
                items.push(doc.data());
            }
        });
        return items;
    } catch (error) {
        _createError(error, 'DBService:getBulletins');
        return [];
    }
}

export const _getPost = async (id) => {
    try {
        const docRef = doc(collection(db, 'Posts'), id);
        return (await getDoc(docRef)).data();
    } catch (error) {
        _createError(error, 'DBService:getPost');
    }
}

export const _createUserRecord = async (user) => {
    try {
        const docRef = doc(collection(db, 'Users'), user.uid);
        // as convention, the id of the document is added to 
        // the document in all documents
        user.id = user.uid;
        await setDoc(docRef, user);
        return {user};
    } catch (error) {
        _createError(error, 'DBService:createUserRecord');
    }
}

export const _setUserTheme = async (user, theme) => {
    if(!user) return;
    try {
        const docRef = doc(collection(db, 'Users'), user.uid);
        // as convention, the id of the document is added to 
        // the document in all documents
        const result = await updateDoc(docRef, {theme});
        return result;
    } catch (error) {
        _createError(error, 'DBService:_setUserTheme');
    }
}

export const _setUserLanguage = async (user, language) => {
    if(!user) return;
    try {
        const docRef = doc(collection(db, 'Users'), user.uid);
        // as convention, the id of the document is added to 
        // the document in all documents
        const result = await updateDoc(docRef, {language});
        return result;
    } catch (error) {
        _createError(error, 'DBService:_setUserLanguage');
    }
}

export const _getUserRecord = async (uid) => {
    try {
        const docRef = doc(collection(db, 'Users'), uid);
        return (await getDoc(docRef)).data();
    } catch (error) {
        _createError(error, 'DBService:getUserRecord');
    }
}