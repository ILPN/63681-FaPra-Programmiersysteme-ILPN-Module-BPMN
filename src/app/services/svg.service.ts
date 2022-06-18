import {Injectable} from '@angular/core';
import {Diagram} from '../classes/diagram/diagram';
import {Element} from '../classes/diagram/element';
import { DragDiagram } from '../classes/diagram/DragDiagram';

@Injectable({
    providedIn: 'root'
})
export class SvgService {

    public createSvgElements(diagram: DragDiagram): Array<SVGElement> {
        /*
        const result: Array<SVGElement> = [];
        diagram.getElems().forEach(el => {
            result.push(el.updatedSvg())
        });*/

        return [diagram.createDiagramSVG()];
    }
}
