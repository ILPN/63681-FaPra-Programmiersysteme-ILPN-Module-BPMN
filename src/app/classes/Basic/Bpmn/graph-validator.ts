import { ComponentFactoryResolver } from "@angular/core";
import { BpmnNode } from "./BpmnNode"
import { BpmnUtils } from "./BpmnUtils"
import { BpmnEventEnd } from "./events/BpmnEventEnd";
import { BpmnEventIntermediate } from "./events/BpmnEventIntermediate";
import { BpmnEventStart } from "./events/BpmnEventStart";
import { BpmnGateway } from "./gateways/BpmnGateway";
import { BpmnTask } from "./tasks/BpmnTask";


export class Validator {
    private startEvents: BpmnEventStart[] = [];
    private endEvents: BpmnEventEnd[] = [];
    private tasks: BpmnTask[] = [];
    private intermediateEvents: BpmnEventIntermediate[] = [];
    private gateways: BpmnGateway[] = [];


    //messages
    public HAS_NO_IN_EDGES = " hat keine eingehenden Kanten. ";
    public HAS_MULTIPLE_IN_EDGES = " hat mehr als eine eingehende Kante. ";
    public HAS_NO_MULTIPLE_IN_EDGES = " hat nicht mindestens zwei eingehende Kante. ";
    public HAS_NO_OUT_EDGES = " hat keine ausgehenden Kanten. ";
    public HAS_MULTIPLE_OUT_EDGES = " hat mehr als eine ausgehende Kante. ";
    public HAS_NO_MULTIPLE_OUT_EDGES = " hat nicht mindestens zwei ausgehende Kante. ";
    public HAS_IN_EDGES = " hat eingehende Kante(n). ";
    public HAS_OUT_EDGES = " hat ausgehende Kante(n). ";
    public NO_START_EVENT = " Es gibt kein Start-Event. "
    public NO_END_EVENT = " Es gibt kein End-Event. "

    constructor(nodes: BpmnNode[]) {

        this.startEvents.push(...BpmnUtils.getStartEvents(nodes))
        this.endEvents.push(...BpmnUtils.getEndEvents(nodes))
        this.gateways.push(...BpmnUtils.getGateways(nodes))
        this.intermediateEvents.push(...BpmnUtils.getIntermedEvents(nodes))
        this.tasks.push(...BpmnUtils.getTasks(nodes))

    }


    /**
     * validates the graph and accumulates error messages
     * @returns accumulated error message and true/false = graph is valid or not
     */
    public validateGraph(): { errors: string, valid: boolean } {
        let message: string = "";

        //validate and accumulate
        message += this.validateTasks().errors;
        message += this.validateStartEvents().errors;
        message += this.validateIntermediateEvents().errors;
        message += this.validateEndEventNodes().errors;
        message += this.validateGateways().errors;
        
        return this.getValidationResult(message);
    };

    private getValidationResult(message: string): { errors: string, valid: boolean } {
        let graphValid = message.trim() === ""
        return { errors : message, valid : graphValid};

    }

    private validateTasks(): { errors: string, valid: boolean } {
        let message: string = "";

        this.tasks.forEach(task => message += this.validateTask(task).errors);

        return this.getValidationResult(message);

    }

    private validateTask(task: BpmnTask): { errors: string, valid: boolean } {
        let message: string = "";

        let messageStart = " Task " + task.label + " ";

        if (BpmnUtils.hasNoInEdges(task))
            message += messageStart + this.HAS_NO_IN_EDGES

        if (BpmnUtils.hasMultipleInEdges(task))
            message += messageStart + this.HAS_MULTIPLE_IN_EDGES

        if (BpmnUtils.hasNoOutEdges(task))
            message += messageStart + this.HAS_NO_OUT_EDGES

        if (BpmnUtils.hasMultipleOutEdges(task))
            message += messageStart + this.HAS_MULTIPLE_OUT_EDGES

        return this.getValidationResult(message);

    }


    private validateStartEvents(): { errors: string, valid: boolean } {

        if (this.startEvents.length === 0)
            return this.getValidationResult(this.NO_START_EVENT);

        let message = "";
        this.startEvents.forEach(startEvent => message += this.validateStartEvent(startEvent).errors);

        return this.getValidationResult(message);
    }

    private validateStartEvent(startEvent: BpmnNode): { errors: string, valid: boolean } {

        let message = "";

        let messageStart = " StartEvent " + startEvent.label + " ";
        if (BpmnUtils.hasInEdges(startEvent))
            message += messageStart + this.HAS_IN_EDGES;

        if (BpmnUtils.hasNoOutEdges(startEvent))
            message += messageStart + this.HAS_NO_OUT_EDGES;

        return this.getValidationResult(message);
    }

    private validateIntermediateEvents(): { errors: string, valid: boolean } {
        let message = "";
        this.intermediateEvents.forEach(intermEvent => message += this.validateIntermediateEvent(intermEvent).errors);
        return this.getValidationResult(message);
    }

    private validateIntermediateEvent(intermEvent: BpmnEventIntermediate): { errors: string, valid: boolean } {

        let message = "";

        let messageStart = " Event " + intermEvent.label + " ";
        if (BpmnUtils.hasNoInEdges(intermEvent))
            message += messageStart + this.HAS_NO_IN_EDGES

        if (BpmnUtils.hasNoOutEdges(intermEvent))
            message += messageStart + this.HAS_NO_OUT_EDGES

        return this.getValidationResult(message);
    }



    private validateEndEventNodes(): { errors: string, valid: boolean } {

        if (this.endEvents.length === 0)
            return this.getValidationResult(this.NO_END_EVENT);

        let message = ""

        this.endEvents.forEach(endEvent => message += this.validateEndEvent(endEvent).errors)

        return this.getValidationResult(message);
    }

    private validateEndEvent(endEvent: BpmnEventEnd): { errors: string, valid: boolean } {
        let message = "";

        let messageStart = " EndEvent " + endEvent.label + " ";
        if (BpmnUtils.hasNoInEdges(endEvent))
            message += messageStart + this.HAS_NO_IN_EDGES

        if (BpmnUtils.hasOutEdges(endEvent))
            message += messageStart + this.HAS_OUT_EDGES

        return this.getValidationResult(message);

    }

    private validateGateways(): { errors: string, valid: boolean } {
        let message = "";

        this.gateways.forEach(gateway => message += this.validateGateway(gateway).errors)

        return this.getValidationResult(message);
    }

    validateGateway(gateway: BpmnGateway): { errors: string, valid: boolean } {
        let message = "";

        let messageStart = " Gateway " + gateway.label + " ";
        if (BpmnUtils.hasNoInEdges(gateway))
            message += messageStart + this.HAS_NO_IN_EDGES

        if (BpmnUtils.hasNoOutEdges(gateway))
            message += messageStart + this.HAS_NO_OUT_EDGES

        if (BpmnUtils.isGatewayJoin(gateway)) {
            if (BpmnUtils.hasOnlyOneInEdge(gateway)) message += messageStart + this.HAS_NO_MULTIPLE_IN_EDGES
            if (BpmnUtils.hasMultipleOutEdges(gateway)) message += messageStart + this.HAS_MULTIPLE_OUT_EDGES
        
        //split gateway
        } else {
            if (BpmnUtils.hasOnlyOneOutEdge(gateway)) message += messageStart + this.HAS_NO_MULTIPLE_OUT_EDGES
            if (BpmnUtils.hasMultipleInEdges(gateway)) message += messageStart + this.HAS_MULTIPLE_IN_EDGES;
            if (BpmnUtils.hasNoMatchingGateway(gateway))
                message += messageStart + this.getNoMatchingGatewayError(gateway)
        }

        return this.getValidationResult(message);
    }


    getNoMatchingGatewayError(gateway: BpmnGateway): string {
        let error = " hat kein entsprechendes "
        if (BpmnUtils.isSplitAnd(gateway))
            return error + " AND-JOIN"

        if (BpmnUtils.isJoinAnd(gateway))
            return error + " AND-SPLIT"

        if (BpmnUtils.isSplitOr(gateway))
            return error + " OR-JOIN"

        if (BpmnUtils.isJoinOr(gateway))
            return error + " OR-SPLIT"

        if (BpmnUtils.isJoinXor(gateway))
            return error + " XOR-SPLIT"

        if (BpmnUtils.isSplitXor(gateway))
            return error + " XOR-JOIN"

        return ""
    }



}
