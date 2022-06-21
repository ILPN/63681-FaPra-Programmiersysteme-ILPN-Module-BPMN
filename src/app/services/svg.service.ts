import {Injectable} from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';

@Injectable({
    providedIn: 'root'
})
export class SvgService {

    public createSvgElements(diagram: BpmnGraph): Array<SVGElement> {
        return [diagram.svgManager.getSvg()];
    }
}
