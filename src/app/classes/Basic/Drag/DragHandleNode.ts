import { BpmnNode } from "../Bpmn/BpmnNode";
import { Svg } from "../Svg/Svg";
import { DragHandle } from "./DragHandle";

export class DragHandleNode extends DragHandle<BpmnNode>{
    override updateAffectedSvgs(): void {
        super.updateAffectedSvgs()
        this.dragedElement.updateSvg()
    }
    protected override createSvg(): SVGElement {
        const copy = this.dragedElement.createSvg() // now the graphsvg contains a duplicate
        this.appendListenerTo(copy)
        return copy
    }
}