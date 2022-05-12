import {Injectable} from '@angular/core';
import {Diagram} from '../classes/diagram/diagram';
import {Element} from '../classes/diagram/element';

@Injectable({
    providedIn: 'root'
})
export class SvgService {

    public createSvgElements(diagram: Diagram): Array<SVGElement> {
        const result: Array<SVGElement> = [];
        diagram.elements.forEach(el => {
            result.push(el.createSvg())
        });
        return result;
    }
}
