import { 
    FacebookAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updatePassword,
    sendEmailVerification,
    getAuth  
} from "firebase/auth";
import { app } from './firebase';

const auth = getAuth(app);

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
    .then((userCredential) => {
        let authUser = userCredential.user;
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
export const changePassword = (newPassword) => new Promise((resolve) => {
    updatePassword(getAuth().currentUser, newPassword)
    .then(() => {
        resolve({});
    })
    .catch((error) => { 
        console.log(error);
        resolve({
            error: error.code,
            message: error.message
        });
    });
})