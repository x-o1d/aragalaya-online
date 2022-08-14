<script>
    import { onMount, onDestroy } from "svelte";

    import { _userLogout } from "$lib/services/auth";   
    import { _emitEvent } from "$lib/services/events";
    import { _appContentReady } from "$lib/services/store";
    
    onMount(() => {
        _userLogout();
    })

    const appContentReadyUnsubscribe = _appContentReady.subscribe((value) => {
        if(value) _emitEvent('show-hide-login', 'admin-login');
    });
    onDestroy(appContentReadyUnsubscribe)

</script>

<div>hello</div>