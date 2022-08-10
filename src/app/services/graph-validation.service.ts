import { Injectable } from '@angular/core';
import { DisplayErrorService } from "./display-error.service";
import { BpmnNode } from "../classes/Basic/Bpmn/BpmnNode";
import { BpmnGraph } from "../classes/Basic/Bpmn/BpmnGraph";
import { BpmnEventEnd } from "../classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventStart } from "../classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnEventIntermediate } from "../classes/Basic/Bpmn/events/BpmnEventIntermediate";
import { BpmnGateway } from "../classes/Basic/Bpmn/gateways/BpmnGateway";
import { BpmnTask } from "../classes/Basic/Bpmn/tasks/BpmnTask";
import { BpmnUtils } from "../classes/Basic/Bpmn/BpmnUtils";

@Injectable({
    providedIn: 'root'
})
export class GraphValidationService {

    constructor(private displayErrorService: DisplayErrorService) {
    }

    // todo: Notizen sind im Todoist

    private errorMessage: string = '';

    isValid(validateableGraph: BpmnGraph): boolean {
        this.validateGraph(validateableGraph.nodes);
        if (this.isEmpty(this.errorMessage)) {
            return true;
        } else {
            this.displayErrorService.displayError(this.errorMessage);
            return false
        }
    }

    resetErrorMessage(): void {
        this.errorMessage = '';
    }

    private validateEndEvents(endEvents: BpmnNode[]): void {
        if (!this.cointainsEndEvent(endEvents)) {
            this.errorMessage += 'Graph enthaelt kein End-Ereignis!\n';
        } else {
            // let outgoingEdgeLabel: string = this.getOutgoingEdgeLabel(endEvents);
            // if (!this.isEmpty(outgoingEdgeLabel)) {
            //     this.errorMessage += `EndEvent mit dem Label "${outgoingEdgeLabel}" enthaelt  einen Ausgang!\n`;
            // }
            // let labelOfStartEventWithInEdges = this.getLabelOfStartEventWithInEdges(endEvents);
            // if (this.isEmpty(labelOfStartEventWithInEdges)) {
            //     this.errorMessage += `EndEvent mit dem Label "${labelOfStartEventWithInEdges}" hat keine eingehende Kanten!\n`;
            // }
            endEvents.forEach(EndEventNode => {
                if (EndEventNode.outEdges.length !== 0) this.errorMessage += "Das End-Ereignis " + BpmnUtils.getNotationNode(EndEventNode) + " verfügt über einen oder mehrere Ausgänge. Dies verstößt gegen Modellierungsrichtlinien.\n"
                if (EndEventNode.inEdges.length === 0) this.errorMessage += "Das End-Ereignis " + BpmnUtils.getNotationNode(EndEventNode) + " verfügt über keinen Eingang.\n"
                if (EndEventNode.inEdges.length > 1) this.errorMessage += "Das End-Ereignis " + BpmnUtils.getNotationNode(EndEventNode) + " verfügt über mehr als einen Eingang. Dies verstößt gegen Modellierungsrichtlinien.\n"
            });
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
            this.errorMessage += 'Graph enthaelt kein Start-Ereignis ';
        } else {
            // let labelOfStartEventWithInEdges = this.getLabelOfStartEventWithInEdges(startEventNodes);
            // if (!this.isEmpty(labelOfStartEventWithInEdges)) {
            //     this.errorMessage += `StartEvent mit dem Label "${labelOfStartEventWithInEdges}" hat eingehende Kanten!\n`;
            // }
            // let outgoingEdgeLabel: string = this.getOutgoingEdgeLabel(startEventNodes);
            // if (this.isEmpty(outgoingEdgeLabel)) {
            //     this.errorMessage += `StartEvent mit dem Label "${outgoingEdgeLabel}" enthaelt  keinen Ausgang!\n`;
            // }
            startEventNodes.forEach(startEventNode => {
                if (startEventNode.inEdges.length !== 0) this.errorMessage += "Das Start-Ereignis " + BpmnUtils.getNotationNode(startEventNode) + " verfügt über einen oder mehrere Eingänge. Dies verstößt gegen Modellierungsrichtlinien.\n"
                if (startEventNode.outEdges.length === 0) this.errorMessage += "Das Start-Ereignis " + BpmnUtils.getNotationNode(startEventNode) + " verfügt über keinen Ausgang.\n"
                if (startEventNode.outEdges.length > 1) this.errorMessage += "Das Start-Ereignis " + BpmnUtils.getNotationNode(startEventNode) + " verfügt über mehr als einen Ausgang. Dies verstößt gegen Modellierungsrichtlinien.\n"
            });
        }
    }

    private validateIntermediateEvents(intermediateEventNodes: BpmnNode[]): void {
            intermediateEventNodes.forEach(intermediateEventNode => {
                this.checkOneInAndOut("Das Zwischen-Ereignis ",intermediateEventNode);
            });
        }
    

    private checkOneInAndOut(typ: String, node: BpmnNode) {
        if (node.inEdges.length === 0) this.errorMessage += typ + " " + BpmnUtils.getNotationNode(node) + " verfügt über keinen Eingang.\n"
        if (node.inEdges.length > 1) this.errorMessage += typ + " " + BpmnUtils.getNotationNode(node) + " verfügt über mehr als einen Eingänge. Dies verstößt gegen Modellierungsrichtlinien und wird nicht empfohlen.\n"
        if (node.outEdges.length === 0) this.errorMessage += typ + " " + BpmnUtils.getNotationNode(node) + " verfügt über keinen Ausgang.\n"
        if (node.outEdges.length > 1) this.errorMessage += typ + " " + BpmnUtils.getNotationNode(node) + " verfügt über mehr als einen Ausgang. Dies verstößt gegen Modellierungsrichtlinien und wird nicht empfohlen.\n"
    }




    private isEmpty(label: string) {
        return label === '';
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

    private isNotXorGateway(node: BpmnNode): boolean {
        return BpmnUtils.isGateway(node) && !BpmnUtils.isXorGateway(node);
    }

    private isNotAndGateway(node: BpmnNode): boolean {
        return BpmnUtils.isGateway(node) && !BpmnUtils.isAndGateway(node);
    }

    private isNotOrGateway(node: BpmnNode): boolean {
        return BpmnUtils.isGateway(node) && !BpmnUtils.isOrGateway(node);
    }

    private isOneLabelEmpty(label1: string, label2: string): boolean {
        return this.isEmpty(label1) || this.isEmpty(label2);
    }


    private validateGateways(gateways: BpmnNode[]): void {
        // todo: refactoring
        gateways.forEach(gateway => {
            // XOR-Gateway-Validierung
            // let gatewayInEdges = gateway.inEdges;
            // if (BpmnUtils.isXorGateway(gateway)) {
            //     gatewayInEdges.forEach(gatewayInEdge => {
            //         if (this.isNotXorGateway(gatewayInEdge.from)) {
            //             if (this.isOneLabelEmpty(gatewayInEdge.from.label, gateway.label)) {
            //                 this.errorMessage += "Ein Gateway (ohne Label) welches kein XOR-Gateway und referenziert auf ein andere Gateway (ohne Label) welches ein XOR-Gateway ist! "
            //             } else {
            //                 this.errorMessage += gatewayInEdge.from.label + " ist kein XOR-Gateway und referenziert auf " + gateway.label + " welches ein XOR-Gateway ist! "
            //             }
            //         }
            //     })
            // }

            // // AND-Gateway-Validierung
            // if (BpmnUtils.isAndGateway(gateway)) {
            //     gatewayInEdges.forEach(gatewayInEdge => {
            //         if (this.isNotAndGateway(gatewayInEdge.from)) {
            //             if (this.isOneLabelEmpty(gatewayInEdge.from.label, gateway.label)) {
            //                 this.errorMessage += "Ein Gateway (ohne Label) welches kein AND-Gateway und referenziert auf ein andere Gateway (ohne Label) welches ein AND-Gateway ist! "
            //             } else {
            //                 this.errorMessage += gatewayInEdge.from.label + " ist kein AND-Gateway und referenziert auf " + gateway.label + " welches ein AND-Gateway ist! "
            //             }
            //         }
            //     })
            // }

            // // OR-Gateway-Validierung
            // if (BpmnUtils.isOrGateway(gateway)) {
            //     gatewayInEdges.forEach(gatewayInEdge => {
            //         if (this.isNotOrGateway(gatewayInEdge.from)) {
            //             if (this.isOneLabelEmpty(gatewayInEdge.from.label, gateway.label)) {
            //                 this.errorMessage += "Ein Gateway (ohne Label) welches kein OR-Gateway und referenziert auf ein andere Gateway (ohne Label) welches ein OR-Gateway ist! "
            //             } else {
            //                 this.errorMessage += gatewayInEdge.from.label + " ist kein OR-Gateway und referenziert auf " + gateway.label + " welches ein OR-Gateway ist! "
            //             }
            //         }
            //     })
            // }
            if (BpmnUtils.isSplitGateway(gateway)) {
                if (gateway.inEdges.length === 0) this.errorMessage += "Das Split-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Eingang.\n"
                if (gateway.inEdges.length > 1) this.errorMessage += "Das Split-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über mehrere Eingänge. Dies verstößt gegen Modellierungsrichtlinien.\n"
                if (gateway.outEdges.length === 0) this.errorMessage += "Das Split-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Ausgang.\n"
                if (gateway.outEdges.length === 1) this.errorMessage += "Das Split-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt nur über einen Ausgang. Dies verstößt gegen Modellierungsrichtlinien.\n"
            } else {
                if (gateway.inEdges.length === 0) this.errorMessage += "Das Join-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Eingang.\n"
                if (gateway.inEdges.length === 1) this.errorMessage += "Das Join-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt nur über einen Eingang. Dies verstößt gegen Modellierungsrichtlinien.\n"
                if (gateway.outEdges.length === 0) this.errorMessage += "Das Join-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Ausgang.\n"
                if (gateway.outEdges.length > 1) this.errorMessage += "Das Join-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über mehrere Ausgänge. Dies verstößt gegen Modellierungsrichtlinien.\n"
            }
            var correspondingGateway = BpmnUtils.getCorrespondingGatewayWithoutType(gateway as BpmnGateway);
            if (correspondingGateway != null) {
                if (BpmnUtils.isJoinGateway(gateway)) {
                    if (!BpmnUtils.splitJoinSameType(correspondingGateway, gateway as BpmnGateway)) {
                        this.gatewayErrorMassage(gateway as BpmnGateway, correspondingGateway);
                    }
                } else {
                    if (!BpmnUtils.splitJoinSameType(gateway as BpmnGateway, correspondingGateway)) {
                        this.gatewayErrorMassage(gateway as BpmnGateway, correspondingGateway);
                    }
                }
            }
        })
    }

    private gatewayErrorMassage(gateway: BpmnGateway, correspondingGateway: BpmnGateway) {
        let nameGateway = BpmnUtils.getNotationNode(gateway);
        let nameCorrespondingGateway = BpmnUtils.getNotationNode(correspondingGateway);
        let splitOrJoinGateway: String = this.gatewaySplitOrJoinAsString(gateway);
        let typGateway: String = this.gatewayTypAsString(gateway);
        let splitOrJoinCorrespondingGateway: String = this.gatewaySplitOrJoinAsString(correspondingGateway);
        let typCorrespondingGateway: String = this.gatewayTypAsString(correspondingGateway);
        this.errorMessage += "Das " + splitOrJoinGateway + "-Gateway " + nameGateway + " hat als zugehöriges " + splitOrJoinCorrespondingGateway + "-Gateway, das Gateway " + nameCorrespondingGateway + ". Diese besitzen jedoch unterschiedliche Typen (" + typGateway + "|" + typCorrespondingGateway + ") und können deshalb nicht zusammengehören.\n"

    }



    private gatewaySplitOrJoinAsString(gateway: BpmnGateway): String {
        if (BpmnUtils.isSplitGateway(gateway)) return "Split";
        if (BpmnUtils.isJoinGateway(gateway)) return "Join";
        return "unbekannt";
    }

    private gatewayTypAsString(gateway: BpmnGateway): String {
        if (BpmnUtils.isOrGateway(gateway)) return "OR";
        if (BpmnUtils.isXorGateway(gateway)) return "XOR";
        if (BpmnUtils.isAndGateway(gateway)) return "AND";
        return "unbekannt";
    }

    private validateGraph(nodes: BpmnNode[]): void {
        let startEvents: BpmnNode[] = [];
        let endEvents: BpmnNode[] = [];
        let tasks: BpmnNode[] = [];
        let intermediateEventNodes: BpmnNode[] = [];
        let gateways: BpmnNode[] = [];


        nodes.forEach(node => {
            if (this.isEndEvent(node)) {
                endEvents.push(node);
            }
            if (this.isStartEvent(node)) {
                startEvents.push(node);
            }
            if (this.isBpmnTask(node)) {
                tasks.push(node);
            }
            if (this.isIntermediateEvent(node)) {
                intermediateEventNodes.push(node);
            }
            if (this.isGateway(node)) {
                gateways.push(node);
            }
        });

        // console.log(startEvents.length);
        // console.log(endEvents.length);
        // console.log('BpmnTask:');
        // console.log(tasks.length);
        // console.log(intermediateEventNodes.length);
        // console.log(gateways.length);
        this.validateEndEvents(endEvents);
        this.validateStartEvents(startEvents);
        this.validateIntermediateEvents(intermediateEventNodes);
        this.validateTasks(tasks);
        this.validateGateways(gateways);
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

    private validateTasks(tasks: BpmnNode[]): void {
        tasks.forEach(task => {
            // let taskLabelOfMissingStartEvent = this.getTaskLabelOfMissingStartEvent(task);
            // if (!this.isEmpty(taskLabelOfMissingStartEvent)) {
            //     this.errorMessage += `Task mit dem Label "${taskLabelOfMissingStartEvent}" enthaelt keinen Eingang. `;
            // }
            // let getLabelOfTaskWithMissingOutEdges = this.hasMissingOutEdges(task);
            // if (!this.isEmpty(getLabelOfTaskWithMissingOutEdges)) {
            //     this.errorMessage += `Task mit dem Label "${getLabelOfTaskWithMissingOutEdges}" hat keine Kanten die auf etwas referenzieren! `;
            // }

                this.checkOneInAndOut("Die Aktivität ",task);
            

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
