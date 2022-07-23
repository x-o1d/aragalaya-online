<script>
    import { themes, current } from '$lib/utils/theme';
    import events from '$lib/services/events';
    import _strings from './strings';
    import { _lang } from '$lib/services/store';
    import { 
        facebookSignin, 
        emailSignup, 
        emailSignin, 
        changePassword 
    } from '$lib/services/auth';
    import Progress from '$lib/components/Progress.svelte';

    let showLogin = false;
    let email, name, password, repeatPassword;
    let emailError, nameError, passwordError, repeatPasswordError;
    let buttonProgress = false;

    let signinOrSignup = 0; // 0: enter_email, 1: signin, 2: signup

    events.register('show-hide-login').subscribe((v) => {
        showLogin = v;
    })

    
    const continueEmailSignin = async () => {
        
        // check if account exists
        if(!signinOrSignup) {
            // validate email
            if(!email || !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
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
            let result = await emailSignup(email, 'CHECK_EMAIL_EXISTS');
            if(result.error == 'auth/email-already-in-use') {
                signinOrSignup = 1;
            } else {
                signinOrSignup = 2;
            }

            return;
        }
        
        // sign in
        if(signinOrSignup == 1) {
            if(!password || (password.length < 6)) {
                passwordError = true;
                return;
            } else {
                passwordError = false;
            }

            let result = await emailSignin(email, password);
            if(result.authUser) {
                showLogin = false;
                events.emit('user-ready', result.authUser);
                reset();
            }
            return;
        }

        // sign up
        if(signinOrSignup == 2) {

            if(!name) {
                nameError = true;
            } else {
                nameError = false;
            }
            if(!password || (password.length < 6)) {
                passwordError = true;
            } else {
                passwordError = false;
            }
            if((password != repeatPassword) && !passwordError) {
                repeatPasswordError = true;
            } else {
                repeatPasswordError = false;
            }
            if(nameError || passwordError || repeatPasswordError) {
                return;
            }

            // NOTE:: since a user is already created with a mock password
            // it is later updated to the value the user entered
            let result = await changePassword(password);
            if(!result.error) {
                showLogin = false;
                events.emit('user-ready', result.authUser);
                reset();
            }
            return;
        }
    }

    const reset = () => {
        signinOrSignup = 0;
        email = '';
        name = '';
        password = '';
        repeatPassword = '';
    }
</script>

{#if showLogin}
<div 
    class="overlay"
    on:click|self={() => showLogin = false}>
    <div class="login_c"
         style="
            --theme-1: {themes[$current].nav[0]};
            --theme-2: {themes[$current].nav[2]};
            --theme-3: {themes[$current].nav[4]};
            --theme-4: {themes[$current].nav[6]};
            --button: {themes[$current].button}">
        <div class="login">
            <span>{_strings['enter'][$_lang]}</span>
            <input 
                type="email"
                class:error={emailError}
                disabled={signinOrSignup}
                placeholder="{_strings['email'][$_lang]}"
                bind:value={email}/>
            {#if signinOrSignup == 2}
            <input 
                type="text"
                class:error={nameError}
                placeholder="{_strings['name'][$_lang]}"
                bind:value={name}/>
            {/if}
            {#if signinOrSignup}
            <input 
                type="password"
                class:error={passwordError}
                placeholder="{_strings['password'][$_lang]}"
                bind:value={password}/>
            {/if}
            {#if signinOrSignup == 2}
            <input 
                type="password"
                class:error={repeatPasswordError}
                placeholder="{_strings['repeat_password'][$_lang]}"
                bind:value={repeatPassword}/>
            {/if}
            <div 
                class="button"
                on:click={async () => {
                    buttonProgress = true;
                    await continueEmailSignin();
                    buttonProgress = false;
                }}>
                {#if buttonProgress}
                <Progress/>
                {:else}
                {_strings['continue'][$_lang]}
                {/if}
            </div>
            <span class="or">{_strings['or'][$_lang]}</span>
            <div 
                class="button facebook"
                on:click={() => facebookSignin()}>
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
    .login_c {
        width: var(--s340px);
        padding: var(--s3_75px);
        background: var(--theme-1);
        background: radial-gradient(
            circle at bottom left, 
            var(--theme-1) 25%, 
            var(--theme-2) 50%,
            var(--theme-3) 75%, 
            var(--theme-4) 100%);
        border-radius: var(--s15px);
        border: var(--s1px) solid #5c5c5c;
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
    input {
        height: var(--s45px);
        width: 90%;
        border-radius: var(--s5px);
        padding: var(--s10px);
        border: var(--s1px) solid var(--button);
        font-size: 1rem;
        font-family: inherit;

        margin-bottom: var(--s18px);
    }
    .error {
        border-width: 2px;
        border-color: #c02e46;
    }
    .button {
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
    }
    .or {
        font-size: 1.2rem;
        color: #5c5c5c;
        margin-bottom: var(--s14px);
    }
    .facebook {
        font-family: 'Roboto', sans-serif;
        font-size: var(--s13px);
        background-color: #0a82ec;
    }
    .fa-facebook-square {
        font-size: 1.3rem;
        margin-right: var(--s10px);
    }

</style>