const { Translate } = require('@google-cloud/translate').v2;
const { Firestore, FieldValue } = require('@google-cloud/firestore');
const functions = require('firebase-functions');
const { google } = require('googleapis');
const { logger } = require("firebase-functions");
const admin = require('firebase-admin');
const service = google.youtube('v3');
const { API_KEY } = require('../sensitive/google-apikey.cjs');
const { API_KEY_PROD } = require('../sensitive/google-apikey-prod.cjs');
const { user } = require('firebase-functions/v1/auth');

admin.initializeApp();

const firestore = new Firestore();
let translate = new Translate();

// for localhost emulate google translate
// TODO: create an api key to be used for localhost emulation
if(process.env.MODE == "localhost") {
    translate = {
        translate: (data) => Promise.resolve([data])
    }
}

// fetch the thumbnail for any videoId properties in data
// so that it can be specified in og:image tag for video post
// social shares
async function getThumbnail(data) {
    logger.info(process.env.MODE)
    for (let key of Object.keys(data)) {
        if(key == 'videoId') {
            let thumbnail = await new Promise((resolve) => {
                service.videos.list({
                    auth: (process.env.MODE == 'prod')? API_KEY_PROD: API_KEY,
                    part: 'snippet',
                    id: data[key],
                }, function(err, response) {
                    if(!err && response.data.items[0]) {
                        resolve(response.data.items[0].snippet.thumbnails.standard);
                    } else {
                        logger.info('Error getting thumbnail: ', err);
                    }
                });
            });
            if(thumbnail) {
                data[key + '_images'] = [{href: thumbnail.url}];
            }
        }
    }
    return data;
}

// go through all of the fields in the data object and translate
// fields which has an accompanying -translate field
// eg: if the data object has a field called 'title'
// the function looks for a field called '_title-translate', if the value
// of this field is true, 'title' is translated and replaced with an array of
// four elements. [sinhala_translation, english_translation, tamil_translation, original_text]
//
// the -translate field is added by the form.svelte component in the frontend 
// based on the configuration in column-config.js.
async function translateData(data) {
    const translatedData = {};
    var promises = [];
    for (let key of Object.keys(data)) {
        if(key.startsWith('_')) continue;
        let tempData = [];
        if(data['_' + key + '-translate'] == true) {
            if (data['_' + key + '-type'] == 'html') {
                promises.push(translate.translate(data[key], { to: 'si', format: 'html' })
                    .then(res => { tempData[0] = res[0] }));
                promises.push(translate.translate(data[key], { to: 'en', format: 'html' })
                    .then(res => { tempData[1] = res[0] }));
                promises.push(translate.translate(data[key], { to: 'ta', format: 'html' })
                    .then(res => { tempData[2] = res[0] }));
                tempData[3] = data[key];
                translatedData[key] = tempData;
            } else {
                promises.push(translate.translate(data[key], 'si')
                    .then(res => { tempData[0] = res[0] }));
                promises.push(translate.translate(data[key], 'en')
                    .then(res => { tempData[1] = res[0] }));
                promises.push(translate.translate(data[key], 'ta')
                    .then(res => { tempData[2] = res[0] }));
                tempData[3] = data[key];
                translatedData[key] = tempData;
            }
        } else {
            translatedData[key] = data[key];
        }
    }
    await Promise.all(promises);

    // add machine translated flag
    // TODO: move below logic to the frontend
    Object.keys(translatedData).map(key => {
        if (data['_' + key + '-translate'] == true) {
            translatedData[key + '_MT'] = [
                (translatedData[key][0] != translatedData[key][3]),
                (translatedData[key][1] != translatedData[key][3]),
                (translatedData[key][2] != translatedData[key][3])
            ]
        }
    });

    return translatedData;
}

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '256MB',
};

exports.add_post = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
    logger.info('Input data :', data);

    // check if user token present
    if (!context.auth) {
        throw new HttpsError('failed-precondition', 'The function must be ' +
            'called while authenticated.');
    }

    // translate the -translate marked fields and add _MT flags
    let modifiedData = await translateData(data);
    // fetch youtube thumbnail
    modifiedData = await getThumbnail(modifiedData);

    // if the user has any of the three user roles mark post as verified
    modifiedData.verified = (context.auth.token.super || 
        context.auth.token.admin || 
        context.auth.token.verified || false);

    logger.info('Modified data :', modifiedData);

    // Enter new data into the document.
    let document = firestore.collection('Posts').doc();
    modifiedData.id = document.id;
    await document.set(modifiedData);

    return modifiedData;
});

exports.admin_get_user = functions.runWith(runtimeOpts).https.onCall(async (email, context) => {
    logger.info('Input email :', email);

    // check if user token present
    if (!context.auth) {
        throw new HttpsError('failed-precondition', 'The function must be ' +
            'called while authenticated.');
    }

    // fetch the admin's user record
    let collection = firestore.collection('Users');
    let adminRecord;
    const qs1 = await collection.where('email', '==', context.auth.token.email).get();
    adminRecord = qs1.docs[0].data();
    
    // check if the user is a super admin and the roles in user record and auth token
    // match
    if(!(context.auth.token.super && adminRecord.super)) {
        logger.info('not-authorized');
        return { error: 'not-authorized', message: 'this incident will be reported as a potential infiltration attempt' }
    }

    // return the user record
    let userRecord;
    const qs2 = await collection.where('email', '==', email).get();
    if(qs2.docs[0]) {
        userRecord = qs2.docs[0].data();
    }
    
    return userRecord;
});

exports.admin_change_role = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
    logger.info('Input data :', data);

    // check if user token present
    if (!context.auth) {
        throw new HttpsError('failed-precondition', 'The function must be ' +
            'called while authenticated.');
    }

    // fetch the admin's user record
    let collection = firestore.collection('Users');
    let adminRecord;
    const adminDoc = await collection.doc(context.auth.token.uid).get();
    adminRecord = adminDoc.data();
    
    // check if the user is a super admin and the roles in user record and auth token
    // match
    if(!(context.auth.token.super && adminRecord.super)) {
        logger.info('not-authorized');
        return { error: 'not-authorized', message: 'this incident will be reported as a potential infiltration attempt' }
    }

    const roles = {
        super: (data.role == 'super'),
        admin: (data.role == 'admin'),
        verified: (data.role == 'verified'),
    }
    
    // update auth user custom claims
    await admin.auth().setCustomUserClaims(data.uid, roles);
    // update user record roles
    let userRecord = await collection.doc(data.uid).update(roles);

    return userRecord;
});

exports.admin_toggle_verified = functions.runWith(runtimeOpts).https.onCall(async (id, context) => {
    logger.info('Input data :', id);

    // check if user token present
    if (!context.auth) {
        throw new HttpsError('failed-precondition', 'The function must be ' +
            'called while authenticated.');
    }

    // fetch the admin's user record
    let collection = firestore.collection('Users');
    let adminRecord;
    const adminDoc = await collection.doc(context.auth.token.uid).get();
    adminRecord = adminDoc.data();

    // check if the user is an admin or a super admin, and the roles in both 
    // the user record and user token claims match
    if(!((context.auth.token.super && adminRecord.super)
        || (context.auth.token.admin && adminRecord.admin))) 
    {
        logger.info('not-authorized');
        return { error: 'not-authorized', message: 'this incident will be reported as a potential infiltration attempt' }
    }

    // get the post
    let collection2 = firestore.collection('Posts');
    let post = await (await collection2.doc(id).get()).data();
    // toggle it's verified status
    let newPost = await collection2.doc(id).update({
        verified: !post.verified
    });

    // log the verification: post id <XX> was marked as <STATUS> by admin <ADMINID> at <TIME>
    let collection3 = firestore.collection('Verifications');
    let result = await collection3.add({
        post: id,
        markedAs: !post.verified,
        by: context.auth.token.uid,
        at: (new Date()).getTime()
    });

    return newPost;
});



  