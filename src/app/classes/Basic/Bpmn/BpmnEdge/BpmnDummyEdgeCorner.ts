import { Vector } from "../../../Utils/Vector";
import { DragHandle } from "../../Drag/DragHandle";
import { BpmnEdgeCorner } from "./BpmnEdgeCorner";

export class BpmnDummyEdgeCorner extends BpmnEdgeCorner {
    id:string
    constructor(id:string, pos:Vector){
        super(pos.x, pos.y)
        this.id = id
    }

}