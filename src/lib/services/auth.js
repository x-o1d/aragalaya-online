import { app } from '$lib/config/firebase-config';

import { 
    FacebookAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updatePassword,
    sendEmailVerification,
    getAuth,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import { _createUserRecord, _getUserRecord, _createError } from '$lib/services/database';
import { _emitEvent } from '$lib/services/events';
import { _authStateChecked, _currentTheme, _lang, _signUpInProgress } from './store';

const auth = getAuth(app);

// holds the user record for the session
let user;

// check if a signin/signup is in progress to ignore auth state changes
let signUpInProgress = false;
_signUpInProgress.subscribe((v) => signUpInProgress = v);

// get current user language
let language = 0;
_lang.subscribe((v) => language = v);

// get current user language
let theme = 0;
_currentTheme.subscribe((v) => theme = v);

// listens to auth state changes and updates the local user record
onAuthStateChanged(auth, async (authUser) => {
    if(signUpInProgress) return;
    if (authUser) {
        // if there's no existing user record
        // or if the existing user records uid doesn't match the auth credentials uid
        // fetch the user record
        if(!user || (user && (user.uid != authUser.uid))) {
            console.log('getting user record');
            user = await _getUserRecord(authUser.uid);
        }
        // if a valid token is found on the browser but no correlating user 
        // record is found, it's a stranded user (this can happen due to failed network 
        // requests or other edge cases)
        // force user to re-enter signup data
        if(!user) {
            if(!location.href.includes('admin')) {
                _emitEvent('show-hide-login', 'force-signup');
            }
        } else {
            _emitEvent('user-changed', user);
            return;
        }
    }
    _emitEvent('user-changed', undefined);
    _authStateChecked.set(true);
});

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

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
export const _changePassword = (newPassword, name, email, authUserExists) => new Promise(async (resolve) => {
    try {
        let authUser = getAuth().currentUser;
        user = await _createUserRecord({
            name,
            email,
            uid: authUser.uid,
            language: language || 0,
            theme: theme || 0
        });

        let result;
        if(!authUserExists) {
            result = await updatePassword(authUser, newPassword);
        }
        
        resolve(result);
    } catch (error) {
        _createError(error);
    }
});

export const _userLogout = () => {
    console.log('signing out');
    signOut(auth);
    user = undefined;
    _emitEvent('user-changed', undefined);
}