import { 
    FacebookAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updatePassword,
    sendEmailVerification,
    getAuth,
    onAuthStateChanged
} from "firebase/auth";
import { app } from './firebase';

import { createUserRecord, getUserRecord } from '$lib/services/database';
import { events } from '$lib/services/events';

const auth = getAuth(app);

// holds the user record for the session
export let user;

onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
        user = await getUserRecord(authUser.uid);
        if(!user) {
            console.log('no user record for', authUser);
        } else {
            events.emit('user-ready', user);
        }
    } else {
        console.log('sign in failed');
    }
});

export const userSignedIn = () => {
    let authUser = getAuth().currentUser;
    return (authUser.uid == user.uid) && user;
}

export const facebookSignin = () => {
    const provider = new FacebookAuthProvider();
    
    signInWithPopup(auth, provider)
    .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        // ...
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
    });
}

// args: email: string, password: string
// returns: Promise<{
//     authUser: auth user object
//     error: error code
//     message: error message
// }>
export const emailSignup = (email, password) => new Promise((resolve) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        let authUser = userCredential.user;
        sendEmailVerification(authUser);
        resolve({authUser});
    })
    .catch((error) => {
        resolve({
            error: error.code,
            message: error.message
        })
    });
})

// args: email: string, password: string
// returns: Promise<{
//     authUser: auth user object
//     error: error code
//     message: error message
// }>
export const emailSignin = (email, password) => new Promise((resolve) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        let authUser = userCredential.user;
        user = await getUserRecord(authUser.uid);
        resolve({user});
    })
    .catch((error) => {
        resolve({
            error: error.code,
            message: error.message
        })
    });
})

// args: email: string, password: string
// returns: Promise<{
//     authUser: auth user object
//     error: error code
//     message: error message
// }>
export const changePassword = (newPassword, name, email) => new Promise((resolve) => {
    let authUser = getAuth().currentUser;
    updatePassword(authUser, newPassword)
    .then(async () => {
        user = await createUserRecord({
            name,
            email,
            uid: authUser.uid,
            language: 0,
            theme: 0
        });
        resolve({user});
    })
    .catch((error) => { 
        console.log(error);
        resolve({
            error: error.code,
            message: error.message
        });
    });
})