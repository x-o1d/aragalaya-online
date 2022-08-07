<!-- Card component sets the boundary for all post components
--->
<script></script>

<div class="card-container">
    <div class="card">
        <slot/>
    </div>
</div>

<style>
    .card-container {
        padding: var(--theme-cardseparationhalf);
    }
    .card {
        position: relative;

        max-height: -20px;
        width: 100%;
        border-radius: var(--s3px);
        background-color: white;
        padding: var(--theme-cardpadding);
        overflow: hidden;
    }
</style>