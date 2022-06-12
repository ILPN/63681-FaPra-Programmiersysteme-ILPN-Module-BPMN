import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Diagram} from '../classes/diagram/diagram';
import { MyDiagram } from '../classes/diagram/MyDiagram';

@Injectable({
    providedIn: 'root'
})
export class DisplayService implements OnDestroy {

    private _diagram$: BehaviorSubject<MyDiagram>;

    constructor() {
        this._diagram$ = new BehaviorSubject<MyDiagram>(new MyDiagram());
    }

    ngOnDestroy(): void {
        this._diagram$.complete();
    }

    public get diagram$(): Observable<MyDiagram> {
        return this._diagram$.asObservable();
    }

    public get diagram(): MyDiagram {
        return this._diagram$.getValue();
    }

    public display(net: MyDiagram) {
        this._diagram$.next(net);
    }

}
