import { BpmnEdge } from "../Bpmn/BpmnEdge/BpmnEdge";
import { BpmnUtils } from "../Bpmn/BpmnUtils";


export class SwitchableEdge {
    private _bpmnEdge: BpmnEdge;



    public get edge(): BpmnEdge {
        return this._bpmnEdge;
    }

    constructor(edge: BpmnEdge) {
        this._bpmnEdge = edge
    }

    get bpmnEdge(): BpmnEdge {
        return this._bpmnEdge
    }


}