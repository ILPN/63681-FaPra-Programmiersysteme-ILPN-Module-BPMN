import { Injectable } from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { applySugiyama } from '../classes/Sugiyama/SugiyamaForDiagram';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    public layout(diagram: BpmnGraph, w:number, h:number): void {
        applySugiyama(diagram, w, h, 100);
    }
}
