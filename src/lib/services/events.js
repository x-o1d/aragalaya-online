import { Subject } from 'rxjs';

class EventService {

    events = [];
  
    constructor() {}
  
    emit(tag, value) {
        let event = this.events.find((event) => (tag == event.tag));
        if(event) {
            event.emitter.next(value);
        }
    }
  
    register(tag) {
        let subject;
        let event = this.events.find((event) => (tag == event.tag));
        if(event) {
            subject = event.emitter;
        } else {
            subject = new Subject();
            this.events.push({
                tag: tag,
                emitter: subject
            });
        }
        return subject;
    };
}

export const events = new EventService();
