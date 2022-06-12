import {Injectable} from '@angular/core';
import {Diagram} from '../classes/diagram/diagram';
import {Element} from '../classes/diagram/element';
import { MyDiagram } from '../classes/diagram/MyDiagram';

@Injectable({
    providedIn: 'root'
})
export class SvgService {

    public createSvgElements(diagram: MyDiagram): Array<SVGElement> {
        /*
        const result: Array<SVGElement> = [];
        diagram.getElems().forEach(el => {
            result.push(el.updatedSvg())
        });*/

        return [diagram.createDiagramSVG()];
    }
}
