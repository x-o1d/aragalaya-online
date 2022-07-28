import { 
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
import { getFirestore } from "firebase/firestore";
import { dev } from '$app/env';
import { app } from './firebase';

const db = getFirestore(app);

export const createError = async (error, caller) => {
    try {
        if(dev) {
            console.error(caller, error);
            return;
        } else {
            const docRef = await addDoc(collection(db, 'Errors'), {
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

export const getPosts = async (type) => {
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
        createError(error, 'DBService:getBulletins');
        return [];
    }
}

export const createPost = async (item) => {
    try {
        const docRef = doc(collection(db, 'Posts'));
        item.id = docRef.id;
        await setDoc(docRef, item);
        return item;
    } catch (error) {
        createError(error, 'DBService:createPost');
    }
}

export const addPhoto = async (item) => {
    try {
        const docRef = doc(collection(db, 'Images'));
        await setDoc(
            docRef,
            {
                ...item,
                id: docRef.id
            }
        );
    } catch (error) {
        createError(error, 'DBService:addPhoto');
    }
}

export const createUserRecord = async (user) => {
    try {
        const docRef = doc(collection(db, 'Users'), user.uid);
        // as convention, the id of the document is added to 
        // the document in all documents
        user.id = user.uid;
        await setDoc(docRef, user);
        return {user};
    } catch (error) {
        createError(error, 'DBService:createUserRecord');
    }
}

export const getUserRecord = async (uid) => {
    try {
        const docRef = doc(collection(db, 'Users'), uid);
        return (await getDoc(docRef)).data();
    } catch (error) {
        createError(error, 'DBService:getUserRecord');
    }
}