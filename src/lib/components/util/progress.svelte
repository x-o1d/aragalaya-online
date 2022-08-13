<script>
    export let move = 4;
    export let length = 3;
    export let delay = 300;
    export let style = '';

    let position = 0;
    let direction = false;
    let progress = '';

    setInterval(() => {
        
        if(!direction && (position < move)) {
            position++;
        }
        if(direction && (position > 0)) {
            position--;
        }
        if(!position || (position == move)) {
            direction = !direction;
        }

        progress = '';
        for(let i=0; i<position; i++) {
            progress += ' ';
        }
        for(let i=0; i<length; i++) {
            progress += '.';
        }
        for(let i=0; i<(move-position); i++) {
            progress += ' ';
        }

    }, delay);
</script>

<div 
    class="progress"
    style={style}>
    {progress}
</div>

<style>
    .progress {
        white-space: pre;
        color: inherit;
    }
</style>
