<script>
    import { onDestroy } from "svelte";

    import { _userLogout } from "$lib/services/auth";   
    import { _emitEvent } from "$lib/services/events";
    import { _appContentReady } from "$lib/services/store";
    import { _adminGetUser, _adminChangeRole } from "$lib/services/functions";

    import Input from '$lib/components/input/text-input.svelte';
    import Select from '$lib/components/input/select.svelte';
    
    _userLogout();

    const appContentReadyUnsubscribe = _appContentReady.subscribe((value) => {
        if(value) _emitEvent('show-hide-login', 'admin-login');
    });
    // clear subscription
    onDestroy(appContentReadyUnsubscribe);

    let formData = {};
    let emailError = false;

    let user;
    let role;
    const getUser = async () => {
        const result = await _adminGetUser(formData.email);
        user = result.data;
        if(!user) {
            emailError = true;
            role = undefined;
            return;
        }
        if(user.super) role = 'super';
        else if(user.admin) role = 'admin';
        else if(user.verified) role = 'verified';
        else role = undefined;
    }

    let emailConfig = {
        name: 'email',
        type: 'text',
        maxlength: 100,
        placeholder: [
            'enter user email'
        ],
        error: false
    };

    let roleOptions = [{
        name: 'none',
        strings: 'none'
    }, {
        name: 'verified',
        strings: 'verified'
    }, {
        name: 'admin',
        strings: 'admin'
    }, {
        name: 'super',
        strings: 'super'
    }];

    const selectRole = (e) => {
        role = e.detail.name;
        _adminChangeRole(user.uid, role);
    }
</script>

<div class="user-management">
    <div class="admin-column">
        <Input
            config={emailConfig}
            data={formData}
            on:enter={getUser}
            error={emailError}/>

        {#if user}
        <div class="user">
            <div class="email">{user.name} : {user.email}</div>
            <div class="role">
                <Select
                    value={role}
                    options={roleOptions}
                    placeholder="---"
                    on:select={selectRole}/>
            </div>
        </div>
        {/if}
    </div>
</div>

<style>
    .user-management {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 100vh;
        width: 100vw;
    }
    .admin-column {
        width: var(--s500px);
    }
    .user {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 90%;
    }
    .email {
        display: inline-block;
        padding: var(--s5px);
    }
    .role {
        display: inline-flex;
        justify-content: right;
        width: var(--s100px);
    }
</style>