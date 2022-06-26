<script>
    import { themes, current } from '$lib/utils/theme';
    import events from '$lib/services/events';
    import _strings from './strings';
    import { _lang } from '$lib/services/store';

    let showLogin = false;
    let email;

    events.register('show-hide-login').subscribe((v) => {
        showLogin = v;
    })
</script>

{#if showLogin}
<div 
    class="overlay"
    on:click={() => showLogin = false}>
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
                type="text"
                placeholder="{_strings['email'][$_lang]}"
                bind:value={email}/>
            <div class="button">
                {_strings['continue'][$_lang]}
            </div>
            <span class="or">{_strings['or'][$_lang]}</span>
            <div class="button facebook">
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
        padding: var(--s18px);
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
        margin-bottom: var(--s18px);
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