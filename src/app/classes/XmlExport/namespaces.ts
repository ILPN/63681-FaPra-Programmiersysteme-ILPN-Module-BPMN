import { Random } from "./utils"

/**
 * XML namespaces and tags
 */
export class Namespace {

    public static BPMN = "http://www.omg.org/spec/BPMN/20100524/MODEL"
    public static XSI = "http://www.w3.org/2001/XMLSchema-instance"
    public static BPMNDI = "http://www.omg.org/spec/BPMN/20100524/DI"
    public static DC = "http://www.omg.org/spec/DD/20100524/DC"
    public static DI = "http://www.omg.org/spec/DD/20100524/DI"
    public static TARGET = "http://bpmn.io/schema/bpmn"

    //BPMN Process and children
    public static BPMN_prefix = "bpmn:"
    public static DEFINITIONS = "definitions"
    public static DEFINITIONS_ID = this.id(this.DEFINITIONS)
    public static DEFINITIONS_ELEMENT = this.bpmn(this.DEFINITIONS)
    public static PROCESS = "process"
    public static PROCESS_ID = this.id(this.PROCESS)
    public static PROCESS_ELEMENT = this.bpmn(this.PROCESS)
    public static START = "startEvent"
    public static START_ELEMENT = this.bpmn(this.START)
    public static END = "endEvent"
    public static END_ELEMENT = this.bpmn(this.END)
    public static INTERMEDIATE_EVENT = "intermediateThrowEvent"
    public static INTERMEDIATE_EVENT_ELEMENT = this.bpmn(this.INTERMEDIATE_EVENT)
    public static OUTGOING = "outgoing"
    public static OUTGOING_ELEMENT = this.bpmn(this.OUTGOING)
    public static INCOMING = "incoming"
    public static INCOMING_ELEMENT = this.bpmn(this.INCOMING)
    public static MANUAL_TASK = "manualTask"
    public static MANUAL_TASK_ELEMENT = this.bpmn(this.MANUAL_TASK)
    public static BUSINESSRULE_TASK = "businessRuleTask"
    public static BUSINESSRULE_ELEMENT = this.bpmn(this.BUSINESSRULE_TASK)
    public static SERVICE_TASK = "serviceTask"
    public static SERVICE_TASK_ELEMENT = this.bpmn(this.SERVICE_TASK    )
    public static USER_TASK = "userTask"
    public static USER_TASK_ELEMENT = this.bpmn(this.USER_TASK)
    public static RECEIVE_TASK = "receiveTask"
    public static RECEIVE_TASK_ELEMENT = this.bpmn(this.RECEIVE_TASK)
    public static SEND_TASK = "sendTask"
    public static SEND_TASK_ELEMENT = this.bpmn(this.SEND_TASK)
    public static TASK = "task"
    public static TASK_ELEMENT = this.bpmn(this.TASK)
    public static SEQUENCE_FLOW = "sequenceFlow"
    public static SEQUENCE_FLOW_ELEMENT = this.bpmn(this.SEQUENCE_FLOW)
    public static PARALLEL_GATEWAY = "parallelGateway" //AND
    public static PARALLEL_GATEWAY_ELEMENT = this.bpmn(this.PARALLEL_GATEWAY)
    public static EXCLUSIVE_GATEWAY = "exclusiveGateway" //XOR
    public static EXCLUSIVE_GATEWAY_ELEMENT = this.bpmn(this.EXCLUSIVE_GATEWAY)
    public static INCLUSIVE_GATEWAY = "inclusiveGateway" //OR
    public static INCLUSIVE_GATEWAY_ELEMENT = this.bpmn(this.INCLUSIVE_GATEWAY)
    public static GATEWAY = "gateway"
    public static GATEWAY_ELEMENT = this.bpmn(this.GATEWAY)

    //BPMNDI Diagram and children
    public static BPMNDI_prefix = "bpmndi:"
    public static DIAGRAM = "BPMNDiagram"
    public static PLANE = "BPMNPlane"
    public static SHAPE = "BPMNShape"
    public static EDGE = "BPMNEdge"
    public static FLOW = "Flow"

    public static DIAGRAM_ID = this.id(this.DIAGRAM)
    public static PLANE_ID = this.id(this.PLANE)

    public static DIAGRAM_ELEMENT = this.bpmndi(this.DIAGRAM)
    public static PLANE_ELEMENT = this.bpmndi(this.PLANE)
    public static SHAPE_ELEMENT = this.bpmndi(this.SHAPE)
    public static EDGE_ELEMENT = this.bpmndi(this.EDGE)

    //DC
    public static DC_prefix = "dc:"
    public static BOUNDS = "Bounds"
    public static BOUNDS_ELEMENT = this.dc(this.BOUNDS)

     //DI
     public static DI_prefix = "di:"
     public static WAYPOINT = "waypoint"
     public static WAYPOINT_ELEMENT = this.di(this.WAYPOINT)

    static id(element: string): string {
        return element + "_" + Random.id()
    }

    static bpmndi(element: string): string{
        return this.BPMNDI_prefix + element
    }

    static bpmn(element: string): string{
        return this.BPMN_prefix + element
    }

    static dc(element: string): string{
        return this.DC_prefix + element
    }

    static di(element: string): string{
        return this.DI_prefix + element
    }

}