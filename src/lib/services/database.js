import { app } from '$lib/config/firebase-config';
import { _environment } from '$lib/config/environment';

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
    arrayUnion,
    getDoc
} from "firebase/firestore";

const db = getFirestore(app);

import { dev } from '$app/env';

// get DataBase Name based on the environment
const DBN = (name) => {
    // Users database is the same for all environments
    if(name == 'Users') {
        return name;
    }
    if(_environment == 'prod') {
        return name + '-prod';
    }
    return name;
}

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

export const _createError = async (error, caller) => {
    try {
        if(dev) {
            console.error(caller, error);
            return;
        } else {
            console.error(caller, error);
            const docRef = await addDoc(collection(db, DBN('Errors')), {
                message: error.message,
                code: error.code,
                caller: caller,
                signedin: getAuth().currentUser != null,
                time: (new Date()).getTime()
            });
        }
        
    } catch (error) {
        console.log(`couldn't save error:`, error);
    }
}

export const _getPosts = async (type) => {
    try {
        const c = collection(db, DBN('Posts'));
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
        const docRef = doc(collection(db, DBN('Posts')), id);
        return (await getDoc(docRef)).data();
    } catch (error) {
        _createError(error, 'DBService:getPost');
    }
}

export const _createUserRecord = async (user) => {
    try {
        const docRef = doc(collection(db, DBN('Users')), user.uid);
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
    try {
        const docRef = doc(collection(db, DBN('Users')), user.uid);
        // as convention, the id of the document is added to 
        // the document in all documents
        const result = await updateDoc(docRef, {theme});
        return result;
    } catch (error) {
        _createError(error, 'DBService:createUserRecord');
    }
}

export const _getUserRecord = async (uid) => {
    try {
        const docRef = doc(collection(db, DBN('Users')), uid);
        return (await getDoc(docRef)).data();
    } catch (error) {
        _createError(error, 'DBService:getUserRecord');
    }
}