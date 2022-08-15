import admin from "firebase-admin";
import serviceAccount from '../../sensitive/aragalaya-online-firebase-adminsdk-zcdt4-22ed1d0de0.js';
// import serviceAccount from '../../sensitive/aragalaya-online-prod-0479312d2de7.js';

let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let uid = '8A78JjD299cw90gfwHlgbZFhqGo2'

const claims = {
    admin: true,
}
  
const firestore = admin.firestore(app);
const collection = firestore.collection('Users');

const setData = async () => {
    await admin.auth().setCustomUserClaims(uid, claims);
    let docRef = collection.doc(uid);
    await docRef.update({
        ...claims
    });
    console.log(claims, 'added to', uid);
}

setData();



