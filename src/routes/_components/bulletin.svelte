<script>
    import Date from './date/index.svelte';
    import { _lang } from '$lib/services/store';
    import Font from './font.svelte';

    export let data;
    
</script>

<div>
    <Date date={data.createdOn}/>
    <div class="title">
        <Font 
            group={1}
            remSize={1.4}>
            {data.title[$_lang]}
        </Font>
    </div>
    <div class="author">
        {data.createdByName}
    </div>
    <div class="description">
        {@html data.description[$_lang]}
    </div>
</div>

<style>
    .title {
        font-size: 1.5rem;
        font-weight: bold;
        padding: var(--s7px) 0 0 0;
        letter-spacing: -0.016rem;
    }
    .author {
        font-family: 'Roboto', sans-serif;
        font-size: 11px;
        padding: 0 0 var(--s7px) 0;
        color: rgb(55, 55, 55);
    }
    .description {
        font-size: 1rem;
        padding: var(--s7px) 0;
        color: rgb(57, 56, 56);
        letter-spacing: 0px;
    }
    :global(p) {
        margin: 1px;
    }

</style>