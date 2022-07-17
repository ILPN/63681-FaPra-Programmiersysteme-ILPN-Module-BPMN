import {Injectable} from '@angular/core';
import {SwitchableGraph} from "../classes/Basic/Switch/SwitchableGraph";

@Injectable({
    providedIn: 'root'
})
export class GraphValidationService {

// todo: hier soll dann der DisplaySwitchGraph eingegeben und gecheckt werden.
    validateGraph(switchGraph: SwitchableGraph) {
        console.log('printed in service graph-validation')
        // console.log(switchGraph);

        console.log(switchGraph.switchNodes);
        console.log('print switchNode.isEndEvent');
        switchGraph.switchNodes.forEach(switchNode => {
            console.log('bin ich drinnen?');
            console.log(switchNode.bpmnNode);
            if (switchNode.isEndEvent()) {
                console.log(switchNode);
            } else {
                console.log('nein');
            }
        });
    }
}
