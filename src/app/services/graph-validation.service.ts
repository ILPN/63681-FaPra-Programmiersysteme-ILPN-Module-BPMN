import {Injectable} from '@angular/core';
import {SwitchableNode} from "../classes/Basic/Switch/SwitchableNode";
import {DisplayErrorService} from "./display-error.service";
import {ValidateableGraph} from "../classes/Basic/Interfaces/ValidateableGraph";
import {BpmnNode} from "../classes/Basic/Bpmn/BpmnNode";
import {SwitchableGraph} from "../classes/Basic/Switch/SwitchableGraph";
import {BpmnGraph} from "../classes/Basic/Bpmn/BpmnGraph";
import {BpmnEventEnd} from "../classes/Basic/Bpmn/events/BpmnEventEnd";
import {BpmnEventStart} from "../classes/Basic/Bpmn/events/BpmnEventStart";
import {BpmnEventIntermediate} from "../classes/Basic/Bpmn/events/BpmnEventIntermediate";
import {BpmnGateway} from "../classes/Basic/Bpmn/gateways/BpmnGateway";
import {BpmnTask} from "../classes/Basic/Bpmn/tasks/BpmnTask";

@Injectable({
    providedIn: 'root'
})
export class GraphValidationService {
    constructor(private displayErrorService: DisplayErrorService) {
    }

    // gucken ob man die Fehlermeldungen alle untereinander ausgibt. Evtl errorMessages: string[] und dann ausgeben lassen
    private errorMessage: string = '';

    validateGraph(validateableGraph: ValidateableGraph) {
        if (validateableGraph instanceof SwitchableGraph) {
            this.validateSwitchableGraph(validateableGraph.switchNodes);
        }
        if (validateableGraph instanceof BpmnGraph) {
            this.validateBpmnGraph(validateableGraph.nodes);
        }

        if (this.errorMessage !== '') {
            this.displayErrorService.displayError(this.errorMessage);
        }
    }

    private validateSwitchableGraph(nodes: SwitchableNode[]): void {
        let startEventNodes: SwitchableNode[] = [];
        let endEventNodes: SwitchableNode[] = [];
        let gatewayNodes: SwitchableNode[] = [];
        nodes.forEach(node => {
            if (node.isEndEvent()) {
                endEventNodes.push(node);
            }
            if (node.isStartEvent()) {
                startEventNodes.push(node);
            }
            if (node.isGateway()) {
                gatewayNodes.push(node);
            }
        });
        this.validateEndEventNodes(endEventNodes);
        this.validateStartEventNodes(startEventNodes);
        // this.validateGatewayNodes(gatewayNodes);

    }

    private validateEndEventNodes(endEvents: SwitchableNode[]): void {
        if (this.containsOutEdges(endEvents)) {
            this.errorMessage += 'EndEvent enthaelt einen Ausgang!';
        }
    }

    private validateBpmnEndEventNodes(endEvents: BpmnNode[]): void {
        if (this.containsOutEdgesBpmn(endEvents)) {
            this.errorMessage += 'EndEvent enthaelt einen Ausgang!';
        }
        if (!this.cointainsEndEvent(endEvents)) {
            this.errorMessage += 'enthaelt kein EndEvent!';
        }
    }

    private containsOutEdgesBpmn(endEventNodes: BpmnNode[]): boolean {
        let outEdges: number = 0;
        endEventNodes.forEach(endEventNode => {
            if (endEventNode.outEdges.length > 0) {
                outEdges++;
            }
        });
        return outEdges > 0;
    }

    private containsOutEdges(endEventNodes: SwitchableNode[]): boolean {
        let outEdges: number = 0;
        endEventNodes.forEach(endEventNode => {
            if (endEventNode.containsOutEdges()) {
                outEdges++;
            }
        });
        return outEdges > 0;
    }

    private validateStartEventNodes(startEventNodes: SwitchableNode[]): void {
        if (this.containsInEdges(startEventNodes)) {
            this.errorMessage += 'Fehler, Startevent hat inEdges!';
        }
    }

    private validateBpmnStartEventNodes(startEventNodes: BpmnNode[]): void {
        if (this.containsInEdgesBpmn(startEventNodes)) {
            this.errorMessage += 'Fehler, Startevent hat inEdges!';
        }
        if (!this.cointainsStartEvent(startEventNodes)) {
            this.errorMessage += 'enthaelt kein StartEvent!';
        }

    }

    private containsInEdges(startEventNodes: SwitchableNode[]): boolean {
        let inEdges: number = 0;
        startEventNodes.forEach(startEventNode => {
            if (startEventNode.containsInEdges()) {
                inEdges++;
            }
        });
        return inEdges > 0;
    }

    private containsInEdgesBpmn(startEventNodes: BpmnNode[]): boolean {
        let inEdges: number = 0;
        startEventNodes.forEach(startEventNode => {
            if (startEventNode.inEdges.length > 0) {
                inEdges++;
            }
        });
        return inEdges > 0;
    }

    // todo: work in progress
    private validateGatewayNodes(gatewayNodes: SwitchableNode[]): void {
        console.log('passiert noch nichts');
    }


    private validateBpmnGraph(nodes: BpmnNode[]): void {
        let startEventNodes: BpmnNode[] = [];
        let endEventNodes: BpmnNode[] = [];
        let bpmnTasks: BpmnNode[] = [];
        let intermediateEventNodes: BpmnNode[] = [];
        let gatewayNodes: BpmnNode[] = [];


        nodes.forEach(node => {
            if (this.isEndEvent(node)) {
                endEventNodes.push(node);
            }
            if (this.isStartEvent(node)) {
                startEventNodes.push(node);
            }
            if (this.isBpmnTask(node)) {
                console.log(node.label);
                bpmnTasks.push(node);
            }
            if (this.isIntermediateEvent(node)) {
                intermediateEventNodes.push(node);
            }
            if (this.isGateway(node)) {
                gatewayNodes.push(node);
            }
        });
        console.log(startEventNodes.length);
        console.log(endEventNodes.length);
        console.log('BpmnTask:');
        console.log(bpmnTasks.length);
        console.log(intermediateEventNodes.length);
        console.log(gatewayNodes.length);
        this.validateBpmnEndEventNodes(endEventNodes);
        // this.validateBpmnIntermediateEventNodes(intermediateEventNodes); // muessen erst die passenden Faelle kommen
        this.validateBpmnStartEventNodes(startEventNodes);
        this.validateBpmnTasks(bpmnTasks);
        // this.validateGatewayNodes(gatewayNodes);

    }

    public isBpmnTask(node: BpmnNode): boolean {
        return node instanceof BpmnTask;
    }

    private isEndEvent(node: BpmnNode) {
        return node instanceof BpmnEventEnd;
    }

    private isStartEvent(node: BpmnNode) {
        return node instanceof BpmnEventStart;
    }

    private isGateway(node: BpmnNode) {
        return node instanceof BpmnGateway;
    }

    private cointainsEndEvent(endEvents: BpmnNode[]): boolean {
        let endEventsCounter = 0;
        endEvents.forEach(endEvent => {
            if (this.isEndEvent(endEvent)) {
                endEventsCounter++
            }
        })
        return endEventsCounter > 0;
    }

    private cointainsStartEvent(startEventNodes: BpmnNode[]) {
        let startEventCounter = 0;
        startEventNodes.forEach(startEventNode => {
            if (this.isStartEvent(startEventNode)) {
                startEventCounter++
            }
        })
        return startEventCounter > 0;

    }

    private isIntermediateEvent(node: BpmnNode) {
        return node instanceof BpmnEventIntermediate;
    }

    private validateBpmnIntermediateEventNodes(intermediateEventNodes: BpmnNode[]): void {
        if (this.containsMissingInEdgesBpmn(intermediateEventNodes)) {
            this.errorMessage += 'IntermediateEvent enthaelt keinen Eingang!';
        }
        // if(!this.containsOutEdgesBpmn(intermediateEventNodes)){
        //     this.errorMessage += 'IntermediateEvent enthaelt keinen Ausgang!';
        // }

    }

    // todo: wip - work in progress
    private containsMissingInEdgesBpmn(intermediateEventNodes: BpmnNode[]) {
        let missingInEdges: number = 0;
        intermediateEventNodes.forEach(intermediateEventNode => {
            console.log(intermediateEventNode.outEdges.length);
            console.log(intermediateEventNode.inEdges.length);
            if (intermediateEventNode.inEdges.length == 0) {
                missingInEdges++;
                console.log('containsMissingInEdgesBpmn');
                console.log(intermediateEventNode.label);
            }
        });
        return missingInEdges != 0;
    }

    private validateBpmnTasks(tasks: BpmnNode[]): void {
        tasks.forEach(task => {
            if (this.isAtTheBeginning(task)) {
                this.errorMessage += 'Task enthaelt kein Startevent';
            }
            if (this.hasMissingOutEdges(task)) {
                this.errorMessage += 'Task enthaelt Fehlerhafte Ausgabe/Referenz';
            }
        })

    }

    private isAtTheBeginning(task: BpmnNode): boolean {
        return (task.inEdges.length === 0) && !this.isStartEvent(task);

    }

    private hasMissingOutEdges(task: BpmnNode) {
        return task.outEdges.length === 0;
    }
}
