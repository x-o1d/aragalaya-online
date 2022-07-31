// using rxjs subjects instead of svelte writables have an initial value and is 
// triggered once automatically on subscribe
import { Subject } from 'rxjs';

let events = [];

// --
// properties exposed from services (export const xx) are prepended with
// an underscore (_) so that they can easily be distinguished from component properties.
// --

// triggeres an event with the tag name and value which will be received
// by all listeners created with _registerEvent
// EXAMPLE:
// import { _emitEvent } from '$lib/services/events'
//
// _emitEvent('clear-all-data', { foo: 'bar' });
export const _emitEvent = (tag, value) => {
    let event = events.find((event) => (tag == event.tag));
    if(event) {
        event.emitter.next(value);
    }
}

// creates an event listener with the tag name and returns a Subject(rxjs)
// which can be subscribed to.
// NOTE:: not unsubscribing from an event when a component is destroyed can
// create a memory leak.
// EXAMPLE:
// import { _registerEvent } from '$lib/services/events'
// import { onDestroy } from 'svelte';
//
// const clearDataEvent = _registerEvent('clear-all-data').subscribe(value => {
//     console.log('event data:', value);
//     // do things
// })
//
// onDestroy(() => {
//     clearDataEvent.unsubscribe();
// })
export const _registerEvent = (tag) => {
    let subject;
    let event = events.find((event) => (tag == event.tag));
    if(event) {
        subject = event.emitter;
    } else {
        subject = new Subject();
        events.push({
            tag: tag,
            emitter: subject
        });
    }
    return subject;
};

