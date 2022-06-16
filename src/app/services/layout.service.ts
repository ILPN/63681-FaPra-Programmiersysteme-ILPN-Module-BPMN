import { Injectable } from '@angular/core';
import { Diagram } from '../classes/diagram/diagram';
import { DragDiagram } from '../classes/diagram/DragDiagram';
import { applySugiyama } from '../classes/Sugiyama/SugiyamaForDiagram';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    public layout(diagram: DragDiagram, w:number, h:number): void {
        applySugiyama(diagram, w, h, 100);
    }
}
