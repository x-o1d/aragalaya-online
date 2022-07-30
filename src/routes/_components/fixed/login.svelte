<script>
    import { onDestroy } from 'svelte';

    import { _themes } from '$lib/services/theme';
    import { _registerEvent, _emitEvent } from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    import { _facebookSignin, _emailSignup, _emailSignin, _changePassword } from '$lib/services/auth';

    import _strings from './login-strings';
   
    import Button from '$lib/components/input/button.svelte';
    import TextInput from '$lib/components/input/text-input.svelte';
    import { _createError } from '$lib/services/database';

    let showLogin = false;
    let user = {};
    let emailError, nameError, passwordError, repeatPasswordError;

    let signinOrSignup = 0; // 0: enter_email, 1: signin, 2: signup

    // show or hide the login overlay on show-hide-login events
    // TODO:: try automatic subscribe
    const showHideEvent =_registerEvent('show-hide-login').subscribe((v) => {
        showLogin = v;
    })
    // clear subscription
    onDestroy(() => {
        showHideEvent.unsubscribe();
    })
    
    const continueEmailSignin = async () => {
        // check if account exists
        if(!signinOrSignup) {
            // validate email
            if(!user.email || !user.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                emailError = true;
                return;
            } else {
                emailError = false;
            }
            
            // NOTE:: once the email is entered emailSignup() is 
            // called with a mock password.
            // this is however only used to check if the email is already 
            // registered. unfortunately firebase doesn't provide an api 
            // for this.
            let result = await _emailSignup(user.email, 'CHECK_EMAIL_EXISTS');

            // if a mock user is created save it's uid in the local user object
            if(result.authUser) {
                user.uid = result.authUser.uid;
            }

            // if email already in use, proceed to the sign in step
            if(result.code == 'auth/email-already-in-use') {
                signinOrSignup = 1;
            // else proceed to the sign up step
            } else {
                signinOrSignup = 2;
            }

            return;
        }
        
        // sign in
        if(signinOrSignup == 1) {
            if(!user.password || (user.password.length < 6)) {
                passwordError = true;
                return;
            } else {
                passwordError = false;
            }

            let result = await _emailSignin(user.email, user.password);

            if(result.code === 'auth/wrong-password') {
                passwordError = true;
                return;
            }

            if(result.user) {
                showLogin = false;
                _emitEvent('user-ready', result.user);
                reset();
            }
            return;
        }

        // sign up
        if(signinOrSignup == 2) {

            // name shouldn't be empty
            if(!user.name) {
                nameError = true;
            } else {
                nameError = false;
            }

            // password mucst be atleast 6 characters
            if(!user.password) {
                passwordError = true;
            } else if(user.password.length < 6) {
                passwordError = 'should be atlest 6 characters';
            } else {
                passwordError = false;
            }

            // passwords should match
            if((user.password != user.repeatPassword) && !passwordError) {
                repeatPasswordError = true;
                passwordError = true;
            } else {
                repeatPasswordError = false;
            }

            // validation check
            if(nameError || passwordError || repeatPasswordError) {
                return;
            }

            // NOTE:: since a user is already created with a mock password
            // it is later updated to the value the user entered
            let result = await _changePassword(user.password, user.name, user.email);
            if(!result) {
                showLogin = false;
                _emitEvent('user-ready', user);
                reset();
            }
            return;
        }
    }

    const closeLogin = () => {
        reset();
        showLogin = false;
    };

    const reset = () => {
        user = {};
        nameError = false;
        passwordError = false;
        repeatPasswordError = false;
        signinOrSignup = 0;
    };
</script>

{#if showLogin}
<div 
    class="overlay"
    on:click|self={closeLogin}>
    <div class="login_c">
        <div class="login">
            <span>{_strings['enter'][$_lang]}</span>
            <TextInput
                disabled={signinOrSignup}
                error={emailError}
                data={user}
                config={{
                    placeholder: _strings['email'],
                    name: 'email',
                    type: 'text',
                    autocomplete: 'username'
                }}/>
            {#if signinOrSignup == 2}
            <TextInput
                error={nameError}
                data={user}
                config={{
                    placeholder: _strings['name'],
                    name: 'name',
                    type: 'text',
                    autocomplete: 'name'
                }}/>
            {/if}
            {#if signinOrSignup}
            <TextInput
                error={passwordError}
                data={user}
                config={{
                    placeholder: _strings['password'],
                    name: 'password',
                    type: 'password',
                    autocomplete: (signinOrSignup == 1)? 
                        'current-password': undefined,
                }}/>
            {/if}
            {#if signinOrSignup == 2}
            <TextInput
                error={repeatPasswordError}
                data={user}
                config={{
                    placeholder: _strings['repeat_password'],
                    name: 'repeatPassword',
                    type: 'password',
                }}/>
            {/if}
            <!-- change onclick to a standard on:click event dispatcher -->
            <Button
                onclick={continueEmailSignin}
                text={_strings['continue']}/>
            <span class="or">{_strings['or'][$_lang]}</span>
            <div 
                class="fb-button"
                on:click={() => _facebookSignin()}>
                <i class="fa-brands fa-facebook-square"></i>
                facebook
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .overlay {
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        z-index: 10000;

        width: 100vw;
        height: 100vh;

        background-color: rgba(0,0,0,0.9);
    }
    .overlay:hover {
        cursor: ne-resize;
    }
    .login_c {
        width: var(--s340px);
        padding: var(--s3_75px);
        background: var(--theme-columns-0);
        background: radial-gradient(
            circle at bottom left, 
            var(--theme-columns-0) 25%, 
            var(--theme-columns-2) 50%,
            var(--theme-columns-4) 75%, 
            var(--theme-columns-6) 100%);
        border-radius: var(--s15px);
        border: var(--s1px) solid #5c5c5c;
        cursor: auto;
    }
    .login {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--s20px);
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;
        border-radius: var(--s15px);
        border: var(--s1px) solid #707070;
    }
    span {
        font-size: 1.3rem;
        font-weight: bold;
        color: black;
        margin-bottom: var(--s20px);
    }
    .fb-button {
        display: flex;
        align-items: center;
        justify-content: center;

        height: var(--s45px);
        width: 90%;
        border-radius: var(--s5px);
        padding: var(--s5px);
        background-color: var(--button);
        cursor: pointer;

        color: white;
        font-size: 1.1rem;
        font-weight: bold;

        margin-bottom: var(--s14px);

        font-family: 'Roboto', sans-serif;
        font-size: var(--s13px);
        background-color: #0a82ec;
    }
    .or {
        font-size: 1.2rem;
        color: #5c5c5c;
        margin-bottom: var(--s14px);
    }
    .fa-facebook-square {
        font-size: 1.3rem;
        margin-right: var(--s10px);
    }

</style>