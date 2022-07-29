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

import { _createUserRecord, _getUserRecord, _createError } from '$lib/services/database';
import { _emitEvent } from '$lib/services/events';

const auth = getAuth(app);

// holds the user record for the session
let user;

onAuthStateChanged(auth, async (authUser) => {
    console.log(authUser);
    if (authUser) {
        if((user && (user.uid != authUser.uid)) || !user) {
            user = await _getUserRecord(authUser.uid);
        }
        if(!user) {
            _createError({
                error: 'invalid-user',
                authUser
            }, 'authService::onAuthStateChanged');
        } else {
            _emitEvent('user-ready', user);
        }
    } else {
        console.log('user not signed in');
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
        const user = result.user;

        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        // ...
    })
    .catch((error) => {
        error.credential = FacebookAuthProvider.credentialFromError(error);
        _createError(error, 'authService::_facebookSignin')
    });
}

// args: email: string, password: string
// returns: Promise<{
//     authUser: auth user object
//     error: error code
//     message: error message
// }>
export const _emailSignup = (email, password) => new Promise(async (resolve) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        const authUser = result.user;
        if(authUser) {
            await sendEmailVerification(authUser);
            resolve({authUser});
        }
    } catch (error) {
        if(error.code == 'auth/email-already-in-use') {
            resolve(error);
            return;
        }
        _createError(error, 'authService::_emailSignup');
    }
})

// args: email: string, password: string
// returns: Promise<{
//     authUser: auth user object
//     error: error code
//     message: error message
// }>
export const _emailSignin = (email, password) => new Promise(async (resolve) => {
    try {
        let result = await signInWithEmailAndPassword(auth, email, password);

        if(!(user && (user.uid && result.user.uid))) {
            user = await _getUserRecord(result.user.uid);
        } 
        resolve({user});
    } catch (error) {
        if(error.code == 'auth/wrong-password') {
            resolve(error);
            return;
        }
        _createError(error, 'authService::_emailSignin');
    }
});

// args: email: string, password: string
// returns: Promise<{
//     authUser: auth user object
//     error: error code
//     message: error message
// }>
export const _changePassword = (newPassword, name, email) => new Promise(async (resolve) => {
    try {
        let authUser = getAuth().currentUser;
        user = await _createUserRecord({
            name,
            email,
            uid: authUser.uid,
            language: 0,
            theme: 0
        });
        let result = await updatePassword(authUser, newPassword);
        resolve(result);
    } catch (error) {
        _createError(error);
    }
});