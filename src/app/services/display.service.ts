import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { LayoutService } from './layout.service';

@Injectable({
    providedIn: 'root'
})
export class DisplayService implements OnDestroy {

    private _diagram$: BehaviorSubject<BpmnGraph>;

    constructor(private _layoutService: LayoutService,
        ) {
        this._diagram$ = new BehaviorSubject<BpmnGraph>(new BpmnGraph());
    }

    ngOnDestroy(): void {
        this._diagram$.complete();
    }

    public get diagram$(): Observable<BpmnGraph> {
        return this._diagram$.asObservable();
    }

    public get diagram(): BpmnGraph {
        return this._diagram$.getValue();
    }

    public display(net: BpmnGraph) {
        this._diagram$.getValue().svgManager.getSvg().remove()
        this._layoutService.initalLayoutHasBeenDone = false
        this._diagram$.next(net);
    }

}
