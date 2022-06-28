import { SnapElement } from "./SnapElements/SnapElement";
import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { Position } from "../Interfaces/Position";
import { Svg } from "../Svg/Svg";
import { GetSvgManager } from "../Interfaces/GetSvgManager";
import { SvgManager } from "../Svg/SvgManager/SvgManager";
import { DragHandle } from "./DragHandle";
import { DragManager } from "./DragManager/DragManager";

export class VisibleDragHandle  extends DragHandle implements GetSvgManager{
    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if(this._svgManager == undefined){
            this._svgManager = new SvgManager("VisibleDragHandle",() => Svg.dummyNode(this.dragedElement.getPos()))
        }
        return this._svgManager;
    }

    constructor(draggedElement:Position,dragManager:DragManager){
        super(draggedElement);
        this.svgManager.getSvg().onmousedown = (e) => dragManager.startDrag(e,this)
    }
    override dragTo(newPos: Vector): void {
        super.dragTo(newPos)
        this._svgManager?.redraw()
    }
}