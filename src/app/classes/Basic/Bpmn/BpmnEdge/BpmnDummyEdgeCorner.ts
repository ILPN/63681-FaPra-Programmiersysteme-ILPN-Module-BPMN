import { Vector } from "../../../Utils/Vector";
import { DragHandle } from "../../Drag/DragHandle";
import { BpmnEdgeCorner } from "./BpmnEdgeCorner";

export class BpmnDummyEdgeCorner extends BpmnEdgeCorner  {
    private _id: string;
    public get id(): string {
        return this._id;
    }
    constructor(id:string, pos:Vector){
        super(pos.x, pos.y)
        this._id = id
    }

}