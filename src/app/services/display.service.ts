import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Diagram} from '../classes/diagram/diagram';
import { DragDiagram } from '../classes/diagram/DragDiagram';

@Injectable({
    providedIn: 'root'
})
export class DisplayService implements OnDestroy {

    private _diagram$: BehaviorSubject<DragDiagram>;

    constructor() {
        this._diagram$ = new BehaviorSubject<DragDiagram>(new DragDiagram());
    }

    ngOnDestroy(): void {
        this._diagram$.complete();
    }

    public get diagram$(): Observable<DragDiagram> {
        return this._diagram$.asObservable();
    }

    public get diagram(): DragDiagram {
        return this._diagram$.getValue();
    }

    public display(net: DragDiagram) {
        this._diagram$.next(net);
    }

}
