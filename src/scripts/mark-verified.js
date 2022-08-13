import admin from "firebase-admin";
import fs from "fs";
import serviceAccount from '../../sensitive/aragalaya-online-firebase-adminsdk-zcdt4-22ed1d0de0.js';
// import serviceAccount from '../../sensitive/aragalaya-online-prod-0479312d2de7.js';

let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// let data = JSON.parse(fs.readFileSync('../data/posts.json', 'utf8'));

// console.log(data);

const firestore = admin.firestore(app);
const collection = firestore.collection('Posts');


const getData = async () => {
    let qs = await collection.get();
    qs.docs.forEach(async (doc) => {
        if(doc.id !== '0') {
            let data = doc.data();
            if(data) {
                await collection.doc(doc.id).update({
                    verified: true
                });
            }
        }
    });
}

getData();



