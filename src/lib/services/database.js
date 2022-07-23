import { where, getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { dev } from '$app/env';
import { app } from './firebase'

const db = getFirestore(app);

export const createError = async (error, caller) => {
    try {
        if(dev) {
            console.error(caller, error);
            return;
        }
        // const docRef = await addDoc(collection(db, "Errors"), {
        //     message: error.message,
        //     code: error.code,
        //     caller: caller,
        //     signedin: getAuth().currentUser != null,
        //     time: (new Date()).getTime()
        // });
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
