const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const { logger } = require("firebase-functions");
const { Translate } = require('@google-cloud/translate').v2;
const { Firestore, FieldValue } = require('@google-cloud/firestore');
const nodemailer = require('nodemailer');

const firestore = new Firestore();
const translate = new Translate();

async function translateData(data) {
    if (!htmlTranslateProperties) htmlTranslateProperties = [];
    const translatedData = {};
    var promises = [];
    for (let key of Object.keys(data)) {
        if(key.startsWith('_')) return;
        let tempData = [];
        if (data['_' + key] == 'text') {
            promises.push(translate.translate(data[key], 'si')
                .then(res => { tempData[0] = res[0] }));
            promises.push(translate.translate(data[key], 'en')
                .then(res => { tempData[1] = res[0] }));
            promises.push(translate.translate(data[key], 'ta')
                .then(res => { tempData[2] = res[0] }));
            tempData[3] = data[key];
            translatedData[key] = tempData;
        } else if (data['_' + key] == 'html') {
            promises.push(translate.translate(data[key], { to: 'si', format: 'html' })
                .then(res => { tempData[0] = res[0] }));
            promises.push(translate.translate(data[key], { to: 'en', format: 'html' })
                .then(res => { tempData[1] = res[0] }));
            promises.push(translate.translate(data[key], { to: 'ta', format: 'html' })
                .then(res => { tempData[2] = res[0] }));
            tempData[3] = data[key];
            translatedData[key] = tempData;
        } else {
            translatedData[key] = data[key];
        }
    }
    await Promise.all(promises);

    // add machine translated flag
    Object.keys(translatedData).map(key => {
        if (data['_' + key] == 'text' || data['_' + key] == 'html') {
            translatedData[key + '_MT'] = [
                (translatedData[key][0] != translatedData[key][3]),
                (translatedData[key][1] != translatedData[key][3]),
                (translatedData[key][2] != translatedData[key][3])
            ]
        }
    });

    return translatedData;
}

exports.addpost = functions.https.onCall(async (data, context) => {
    logger.info('Input data :', data);
    const dev = !!data.dev;

    if (!context.auth) {
        throw new HttpsError("failed-precondition", "The function must be " +
            "called while authenticated.");
    }

    const translatedData = await translateData(data);

    logger.info('Translated data :', translatedData);
    // Enter new data into the document.
    let document = firestore.collection('Posts').doc();
    translatedData.id = document.id;
    await document.set(translatedData);

    return translatedData;
});