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

import { _createUserRecord, _getUserRecord } from '$lib/services/database';
import { _emitEvent } from '$lib/services/events';

const auth = getAuth(app);

// holds the user record for the session
let user;

onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
        user = await _getUserRecord(authUser.uid);
        if(!user) {
            console.log('no user record for', authUser);
        } else {
            _emitEvent('user-ready', user);
        }
    } else {
        console.log('sign in failed');
    }
});

// NOTE: properties exposed from services (export) are prepended with
// an _ so that they can easily be distinguished from component properties

// checks if a user is signed in and returns the user object if so
export const _userSignedIn = () => {
    let authUser = getAuth().currentUser;
    return (authUser && user) && (authUser.uid == user.uid) && user;
}

export const _facebookSignin = () => {
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
export const _emailSignup = (email, password) => new Promise((resolve) => {
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
export const _emailSignin = (email, password) => new Promise((resolve) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        let authUser = userCredential.user;
        user = await _getUserRecord(authUser.uid);
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
export const _changePassword = (newPassword, name, email) => new Promise((resolve) => {
    let authUser = getAuth().currentUser;
    updatePassword(authUser, newPassword)
    .then(async () => {
        user = await _createUserRecord({
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