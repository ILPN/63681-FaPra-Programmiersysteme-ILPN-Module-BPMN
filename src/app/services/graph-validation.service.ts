import {Injectable} from '@angular/core';
import {DisplayErrorService} from "./display-error.service";
import {BpmnNode} from "../classes/Basic/Bpmn/BpmnNode";
import {BpmnGraph} from "../classes/Basic/Bpmn/BpmnGraph";
import {BpmnEventEnd} from "../classes/Basic/Bpmn/events/BpmnEventEnd";
import {BpmnEventStart} from "../classes/Basic/Bpmn/events/BpmnEventStart";
import {BpmnEventIntermediate} from "../classes/Basic/Bpmn/events/BpmnEventIntermediate";
import {BpmnGateway} from "../classes/Basic/Bpmn/gateways/BpmnGateway";
import {BpmnTask} from "../classes/Basic/Bpmn/tasks/BpmnTask";
import {BpmnUtils} from "../classes/Basic/Bpmn/BpmnUtils";
import {DisplayViolatedGuidelinesService} from "./display-violated-guidelines.service";

@Injectable({
    providedIn: 'root'
})
export class GraphValidationService {
    private violatedGuidelines: string[] = [];

    constructor(
        private displayErrorService: DisplayErrorService,
        private displayViolatedGuidelinesService: DisplayViolatedGuidelinesService) {
    }

    isSound(validateableGraph: BpmnGraph): boolean {
        this.resetViolatedGuidelines();
        this.resetErrorMessages();
        this.validateGraph(validateableGraph.nodes);
        if (this.violatedGuidelines.length !== 0) {
            this.displayViolatedGuidelinesService.displayViolatedGuidelines(this.violatedGuidelines);
        }
        if (this.displayErrorService.getErrorMessages().length == 0) {
            return true;
        } else {
            this.displayErrorService.showError();
            return false
        }
    }

    resetViolatedGuidelines(): void {
        this.violatedGuidelines = [];
        this.displayViolatedGuidelinesService.resetViolatedGuidelines();
    }

    private validateEndEvents(endEvents: BpmnNode[]): void {
        if (!this.cointainsEndEvent(endEvents)) {
            this.displayErrorService.addErrorMessage('Graph enthält kein Endereignis!');
        } else {
            let outgoingEdgeLabel: string = this.getOutgoingEdgeLabel(endEvents);
            if (!this.isEmpty(outgoingEdgeLabel)) {
                this.displayErrorService.addErrorMessage(`Endereignis mit dem Label "${outgoingEdgeLabel}" enthält  einen Ausgang!`);
            }
            let labelOfStartEventWithInEdges = this.getLabelOfEventWithInEdges(endEvents);
            if (this.isEmpty(labelOfStartEventWithInEdges)) {
                this.displayErrorService.addErrorMessage(`Endereignis mit dem Label "${labelOfStartEventWithInEdges}" hat keine eingehenden Kanten!`);
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
            this.displayErrorService.addErrorMessage('Graph enthält kein Startereignis. ');
        } else {
            let labelOfEventWithInEdges = this.getLabelOfEventWithInEdges(startEventNodes);
            if (!this.isEmpty(labelOfEventWithInEdges)) {
                this.displayErrorService.addErrorMessage(`Startereignis mit dem Label "${labelOfEventWithInEdges}" hat eingehende Kanten!`);
            }
            let outgoingEdgeLabel: string = this.getOutgoingEdgeLabel(startEventNodes);
            if (this.isEmpty(outgoingEdgeLabel)) {
                this.displayErrorService.addErrorMessage(`Startereignis mit dem Label "${outgoingEdgeLabel}" enthält  keinen Ausgang!`);
            }
        }
    }

    private validateIntermediateEvents(intermediateEventNodes: BpmnNode[]): void {
        intermediateEventNodes.forEach(intermediateEventNode => {
            this.checkOneInAndOut(intermediateEventNode);
        });
    }

    private checkOneInAndOut(node: BpmnNode): void {
        let messagePrefix: string = "";
        if (this.isBpmnTask(node)) {
            messagePrefix = "Die Aktivität "
        }
        if (this.isIntermediateEvent(node)) {
            messagePrefix = "Das Zwischen-Ereignis ";
        }
        if (node.inEdges.length === 0) this.displayErrorService.addErrorMessage(messagePrefix + BpmnUtils.getNotationNode(node) + " verfügt über keinen Eingang.");
        if (node.inEdges.length > 1) this.violatedGuidelines.push(messagePrefix + BpmnUtils.getNotationNode(node) + " verfügt über mehr als einen Eingang.");
        if (node.outEdges.length === 0) this.displayErrorService.addErrorMessage(messagePrefix + BpmnUtils.getNotationNode(node) + " verfügt über keinen Ausgang.");
        if (node.outEdges.length > 1) this.violatedGuidelines.push(messagePrefix + BpmnUtils.getNotationNode(node) + " verfügt über mehr als einen Ausgang.");
    }

    private isEmpty(label: string) {
        return label === '';
    }

    private getLabelOfEventWithInEdges(eventNodes: BpmnNode[]): string {
        let label: string = '';
        eventNodes.forEach(eventNode => {
            if (eventNode.inEdges.length > 0) {
                label += eventNode.label;
            }
        });
        return label;
    }

    private validateGateways(gateways: BpmnNode[]): void {
        gateways.forEach(gateway => {
            if (BpmnUtils.isOrGateway(gateway)) {
                this.addOrGatewayErrorMessage(gateway);
            }
            if (BpmnUtils.isSplitGateway(gateway)) {
                this.addSplitGatewayErrorMessages(gateway);
            } else {
                this.addOtherGatewayErrorMessages(gateway);
            }
            const correspondingGateway = BpmnUtils.getCorrespondingGatewayWithoutType(gateway as BpmnGateway);
            if (correspondingGateway != null) {
                if (BpmnUtils.isJoinGateway(gateway)) {
                    if (!BpmnUtils.splitJoinSameType(correspondingGateway, gateway as BpmnGateway)) {
                        this.gatewayErrorMessage(gateway as BpmnGateway, correspondingGateway);
                    }
                } else {
                    if (!BpmnUtils.splitJoinSameType(gateway as BpmnGateway, correspondingGateway)) {
                        this.gatewayErrorMessage(gateway as BpmnGateway, correspondingGateway);
                    }
                }
            }
        })
    }

    private addOrGatewayErrorMessage(gateway: BpmnNode) {
        gateway.label === "" ?
            this.violatedGuidelines.push("In Ihrem Graphen befindet sich ein OR-Gateway. Es empfiehlt sich OR-Gateways grundsätzlich zu meiden.") :
            this.violatedGuidelines.push(`Das Gateway mit dem Label "${gateway.label}" ist ein OR-Gateway. Es empfiehlt sich OR-Gateways grundsätzlich zu meiden.`);
    }

    private addOtherGatewayErrorMessages(gateway: BpmnNode) {
        if (gateway.inEdges.length === 0)
            this.displayErrorService
            .addErrorMessage("Das Join-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Eingang.");
        if (gateway.inEdges.length === 1)
            this.violatedGuidelines
            .push("Das Join-Gateway "
                + BpmnUtils.getNotationNode(gateway)
                + " verfügt nur über einen Eingang. Dies verstößt gegen Modellierungsrichtlinien.");
        if (gateway.outEdges.length === 0)
            this.displayErrorService
            .addErrorMessage("Das Join-Gateway "
                + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Ausgang.");
        if (gateway.outEdges.length > 1)
            this.violatedGuidelines
            .push("Das Join-Gateway "
                + BpmnUtils.getNotationNode(gateway)
                + " verfügt über mehrere Ausgänge. Dies verstößt gegen Modellierungsrichtlinien.");
    }

    private addSplitGatewayErrorMessages(gateway: BpmnNode) {
        if (gateway.inEdges.length === 0)
            this.displayErrorService
            .addErrorMessage("Das Split-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Eingang.");
        if (gateway.inEdges.length > 1)
            this.violatedGuidelines
            .push("Das Split-Gateway "
                + BpmnUtils.getNotationNode(gateway)
                + " verfügt über mehrere Eingänge. Dies verstößt gegen Modellierungsrichtlinien."); // die Fehlermeldung wird geworfen, wenn die Gateways ohne Beschriftung sind
        if (gateway.outEdges.length === 0)
            this.displayErrorService
            .addErrorMessage("Das Split-Gateway " + BpmnUtils.getNotationNode(gateway) + " verfügt über keinen Ausgang.");
        if (gateway.outEdges.length === 1)
            this.violatedGuidelines.push("Das Split-Gateway "
                + BpmnUtils.getNotationNode(gateway)
                + " verfügt nur über einen Ausgang. Dies verstößt gegen Modellierungsrichtlinien."); // die Fehlermeldung wird geworfen, wenn die Gateways ohne Beschriftung sind
    }

    private gatewayErrorMessage(gateway: BpmnGateway, correspondingGateway: BpmnGateway) {
        let nameGateway = BpmnUtils.getNotationNode(gateway);
        let nameCorrespondingGateway = BpmnUtils.getNotationNode(correspondingGateway);
        let splitOrJoinGateway: String = this.gatewaySplitOrJoinAsString(gateway);
        let typGateway: String = this.gatewayTypAsString(gateway);
        let splitOrJoinCorrespondingGateway: String = this.gatewaySplitOrJoinAsString(correspondingGateway);
        let typCorrespondingGateway: String = this.gatewayTypAsString(correspondingGateway);
        this.violatedGuidelines
        .push("Das "
            + splitOrJoinGateway
            + "-Gateway "
            + nameGateway
            + " hat als zugehöriges "
            + splitOrJoinCorrespondingGateway
            + "-Gateway, das Gateway "
            + nameCorrespondingGateway
            + ". Diese besitzen jedoch unterschiedliche Typen ("
            + typGateway + "|" + typCorrespondingGateway
            + ") und können deshalb nicht zusammengehören.");
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
            let taskLabelOfMissingStartEvent = this.getTaskLabelOfMissingStartEvent(task);
            if (!this.isEmpty(taskLabelOfMissingStartEvent)) {
                this.displayErrorService.addErrorMessage(`Aktivität mit dem Label "${taskLabelOfMissingStartEvent}" enthält keinen Eingang.`);
            }
            let getLabelOfTaskWithMissingOutEdges = this.hasMissingOutEdges(task);
            if (!this.isEmpty(getLabelOfTaskWithMissingOutEdges)) {
                this.displayErrorService.addErrorMessage(`Task mit dem Label "${getLabelOfTaskWithMissingOutEdges}" hat keine Kanten die auf etwas referenzieren!`);
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

    private resetErrorMessages() {
        this.displayErrorService.resetErrorMessages();
    }
}
