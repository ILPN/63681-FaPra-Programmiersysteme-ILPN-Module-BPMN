import {Injectable} from '@angular/core';
import {SwitchableNode} from "../classes/Basic/Switch/SwitchableNode";
import {DisplayErrorService} from "./display-error.service";
import {BpmnNode} from "../classes/Basic/Bpmn/BpmnNode";
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

    // todo: gucken ob man die Fehlermeldungen alle untereinander ausgibt. Evtl errorMessages: string[] und dann ausgeben lassen
    private errorMessage: string = '';

    isValid(validateableGraph: BpmnGraph): boolean {
        this.validateGraph(validateableGraph.nodes);
        if (this.isEmpty(this.errorMessage)) {
            this.displayErrorService.displayError(this.errorMessage);
            return false
        } else {
            return true;
        }
    }

    resetErrorMessage(): void {
        this.errorMessage = '';
    }

    private validateEndEvents(endEvents: BpmnNode[]): void {
        if (!this.cointainsEndEvent(endEvents)) {
            this.errorMessage += 'Graph enthaelt kein EndEvent! ';
        } else {
            let outgoingEdgeLabel: string = this.getOutgoingEdgeLabel(endEvents);
            if (this.isEmpty(outgoingEdgeLabel)) {
                this.errorMessage += `EndEvent mit dem Label "${outgoingEdgeLabel}" enthaelt  einen Ausgang!`;
            }
        }
    }

    private getOutgoingEdgeLabel(endEventNodes: BpmnNode[]): string {
        let label: string = '';
        endEventNodes.forEach(endEventNode => {
            if (endEventNode.outEdges.length > 0) {
                label += endEventNode.label;
            }
        });
        return label;
    }

    private validateStartEvents(startEventNodes: BpmnNode[]): void {
        if (!this.cointainsStartEvent(startEventNodes)) {
            this.errorMessage += 'Graph enthaelt kein StartEvent! ';
        } else {
            let labelOfStartEventWithInEdges = this.getLabelOfStartEventWithInEdges(startEventNodes);
            if (this.isEmpty(labelOfStartEventWithInEdges)) {
                this.errorMessage += `StartEvent mit dem Label "${labelOfStartEventWithInEdges}" hat eingehende Kanten! `;
            }
        }

    }

    private isEmpty(label: string) {
        return label !== '';
    }

    private getLabelOfStartEventWithInEdges(startEventNodes: BpmnNode[]): string {
        let label: string = '';
        startEventNodes.forEach(startEventNode => {
            if (startEventNode.inEdges.length > 0) {
                label += startEventNode.label;
            }
        });
        return label;
    }

    // todo: work in progress
    private validateGatewayNodes(gatewayNodes: SwitchableNode[]): void {
        console.log('passiert noch nichts');
    }


    private validateGraph(nodes: BpmnNode[]): void {
        let startEvents: BpmnNode[] = [];
        let endEvents: BpmnNode[] = [];
        let tasks: BpmnNode[] = [];
        let intermediateEventNodes: BpmnNode[] = [];
        let gatewayNodes: BpmnNode[] = [];


        nodes.forEach(node => {
            if (this.isEndEvent(node)) {
                endEvents.push(node);
            }
            if (this.isStartEvent(node)) {
                startEvents.push(node);
            }
            if (this.isBpmnTask(node)) {
                console.log(node.label);
                tasks.push(node);
            }
            if (this.isIntermediateEvent(node)) {
                intermediateEventNodes.push(node);
            }
            if (this.isGateway(node)) {
                gatewayNodes.push(node);
            }
        });
        // console.log(startEvents.length);
        // console.log(endEvents.length);
        // console.log('BpmnTask:');
        // console.log(tasks.length);
        // console.log(intermediateEventNodes.length);
        // console.log(gatewayNodes.length);
        this.validateEndEvents(endEvents);
        // this.validateBpmnIntermediateEventNodes(intermediateEventNodes); // muessen erst die passenden Faelle kommen
        this.validateStartEvents(startEvents);
        this.validateTasks(tasks);
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

    private validateTasks(tasks: BpmnNode[]): void {
        tasks.forEach(task => {
            let taskLabelOfMissingStartEvent = this.getTaskLabelOfMissingStartEvent(task);
            if (this.isEmpty(taskLabelOfMissingStartEvent)) {
                // this.errorMessage += 'Task enthaelt kein Startevent. ';
                this.errorMessage += `Task mit dem Label "${taskLabelOfMissingStartEvent}" enthaelt keinen Eingang. `;
            }
            let getLabelOfTaskWithMissingOutEdges = this.hasMissingOutEdges(task);
            if (this.isEmpty(getLabelOfTaskWithMissingOutEdges)) {
                // this.errorMessage += 'Task enthaelt Fehlerhafte Ausgabe/Referenz';
                this.errorMessage += `Task mit dem Label "${getLabelOfTaskWithMissingOutEdges}" hat keine Kanten die auf etwas referenzieren! `;
            }
        })

    }

    private getTaskLabelOfMissingStartEvent(task: BpmnNode): string {
        if (task.inEdges.length === 0) {
            return task.label;
        }
        return '';

    }

    private hasMissingOutEdges(task: BpmnNode): string {
        if (task.outEdges.length === 0) {
            return task.label;
        }
        return '';
    }
}
