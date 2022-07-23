import * as admin from "firebase-admin";
import * as fs from "fs";

var serviceAccount = require("./sldemands-firebase-adminsdk-zhkwd-4542cad03c.json");

let app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let data = fs.readFileSync('posts.json', 'utf8');

console.log(data);

const firestore = admin.firestore(app);
const collection = firestore.collection('Posts');

let documents = [];
collection.get().then(qs => {
  qs.forEach(doc => {
    documents.push(doc.data())
  })
  fs.writeFile('posts.json', JSON.stringify(documents), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
});

