import { Injectable } from '@angular/core';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }

    parse(text: string): BpmnGraph | undefined {
        const lines = text.split('\n');

        // const result = new Diagram();
        //
        // lines.forEach(line => {
        //     if (line.trimEnd().length > 0) {
        //         result.addElement(this.parseElement(line));
        //     }
        // });
        const result = BpmnGraph.anotherMonsterGraph();

        return result;
    }

}
