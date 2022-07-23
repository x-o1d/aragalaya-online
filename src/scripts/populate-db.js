import admin from "firebase-admin";
import fs from "fs";
import serviceAccount from '../../sensitive/aragalaya-online-firebase-adminsdk-zcdt4-22ed1d0de0.js';

let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let data = JSON.parse(fs.readFileSync('../data/posts.json', 'utf8'));

console.log(data);

const firestore = admin.firestore(app);
const collection = firestore.collection('Posts');

data.forEach(async (document) => {
    if(document.id) {
        const docRef = collection.doc(document.id);
        const res = await docRef.set(document, { merge: true });
        console.log(res);
    }
})


