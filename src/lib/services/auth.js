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
    if (authUser) {
        if(authUser.reloadUserInfo.passwordHash === 'UkVEQUNURUQ=') {
            console.log('user has not set a password: mock account');
            user = null;
        } else {
            user = await _getUserRecord(authUser.uid);
            if(!user) {
                console.log('no user: improper or incomplete signup');
            } else {
                _emitEvent('user-ready', user);
            }
        }
    } else {
        console.log('user nor signed in');
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
        if(error.code !== 'auth/email-already-in-use') {
            _createError(error, 'authService::_emailSignup');
        }
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
        _createError(error, 'authService::_changePassword');
        resolve({
            error: error.code,
            message: error.message
        });
    });
})