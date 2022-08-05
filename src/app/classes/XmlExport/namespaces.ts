import { BpmnTaskSending } from "../Basic/Bpmn/tasks/BpmnTaskSending"
import { Random } from "./random"

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
    public static OUTGOING = "outgoing"
    public static OUTGOING_ELEMENT = this.bpmn(this.OUTGOING)

    //BPMNDI Diagram and children
    public static BPMNDI_prefix = "bpmndi:"
    public static DIAGRAM = "BPMNDiagram"
    public static PLANE = "BPMNPlane"
    public static SHAPE = "BPMNShape"

    public static DIAGRAM_ID = this.id(this.DIAGRAM)
    public static PLANE_ID = this.id(this.PLANE)

    public static DIAGRAM_ELEMENT = this.bpmndi(this.DIAGRAM)
    public static PLANE_ELEMENT = this.bpmndi(this.PLANE)
    public static SHAPE_ELEMENT = this.bpmndi(this.SHAPE)

    //DC
    public static DC_prefix = "dc:"
    public static BOUNDS = "Bounds"
    public static BOUNDS_ELEMENT = this.dc(this.BOUNDS)

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

}