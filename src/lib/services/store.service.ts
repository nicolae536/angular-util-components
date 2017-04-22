import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NgTStore {
    private applicationState = new BehaviorSubject<any>(null);

    addReducer(action: string, reducer: Function) {

    }
}
