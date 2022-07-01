import { Vector } from "src/app/classes/Utils/Vector";
import { Svg } from "../../Svg/Svg";
import { BpmnEdge } from "./BpmnEdge";

export class BpmnEdgeDefault extends BpmnEdge{
    override svgCreation(): SVGElement {
        const svg = super.svgCreation()
        //crossing line
        const distance = 15
        const length = 15
        const lh = length *0.5
        const rad = Vector.DegToRad(70)
        const direction = this.corners[1].getPos().minus(this.corners[0].getPos()).toUnitVector()
        const intersec = this.nodeIntersection1.plus(direction.muliplied(distance))
        const dir = direction.rotate(rad).muliplied(lh)
        const point1 = intersec.plus(dir)
        const point2 = intersec.minus(dir)
        const line = Svg.path([point1, point2])
        svg.appendChild(line)
        return svg
        
    }
}