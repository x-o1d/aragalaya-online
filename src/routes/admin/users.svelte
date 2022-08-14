<script>
    import { onMount, onDestroy } from "svelte";

    import { _userLogout } from "$lib/services/auth";   
    import { _emitEvent } from "$lib/services/events";
    import { _appContentReady } from "$lib/services/store";

    import Input from '$lib/components/input/text-input.svelte';
    
    onMount(() => {
        _userLogout();
    })

    const appContentReadyUnsubscribe = _appContentReady.subscribe((value) => {
        if(value) _emitEvent('show-hide-login', 'admin-login');
    });
    onDestroy(appContentReadyUnsubscribe);

    let formData = {}

    let user;

</script>

<div class="user-management">
    <div class="admin-column">
        <Input
            config={{
                name: 'email',
                type: 'text',
                maxlength: 100,
                placeholder: [
                    'enter user email'
                ],
                required: true,
                validate: (val) => true,
                process: (val) => val,
            }}
            data={formData}
            on:enter={() => {}}/>
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
</style>