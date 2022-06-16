import { Injectable } from '@angular/core';
import { Diagram } from '../classes/diagram/diagram';
import { applySugiyama } from '../classes/Sugiyama/SugiyamaForDiagram';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    public layout(diagram: Diagram, w:number, h:number): void {
        applySugiyama(diagram, w, h, 100);
    }
}
