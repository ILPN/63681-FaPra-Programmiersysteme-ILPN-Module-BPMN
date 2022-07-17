import { Vector } from "../../../Utils/Vector";
import { DragHandle } from "../../Drag/DragHandle";
import { BpmnEdge } from "./BpmnEdge";
import { BpmnEdgeCorner } from "./BpmnEdgeCorner";

export class BpmnDummyEdgeCorner extends BpmnEdgeCorner  {
    private _id: string;
    public get id(): string {
        return this._id;
    }
    constructor(id:string, pos:Vector, edge:BpmnEdge){
        super(pos.x, pos.y, edge)
        this._id = id
    }

}