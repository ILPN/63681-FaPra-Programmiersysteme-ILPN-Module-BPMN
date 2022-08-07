import { BpmnEdge } from "../Basic/Bpmn/BpmnEdge/BpmnEdge";

/**
 * data structure to collect data from different XML and BPMN elements representing Edge
 */
export class Edge{

    //elements under <bpmndi:BPMNPlane>
    sourceShape: Element | undefined
    targetShape: Element | undefined

    //elements under <bpmndi:process>
    sourceElement: Element | undefined
    targetElement: Element | undefined

    constructor(public bpmnEdge : BpmnEdge, public id: string){}



}