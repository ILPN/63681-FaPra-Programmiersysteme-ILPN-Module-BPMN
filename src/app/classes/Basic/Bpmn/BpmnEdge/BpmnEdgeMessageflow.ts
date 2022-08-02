import { Vector } from "src/app/classes/Utils/Vector";
import { Svg } from "../../Svg/Svg";
import { BpmnEdge } from "./BpmnEdge";

export class BpmnEdgeMessageflow extends BpmnEdge{
    override svgCreation(): SVGElement {
        const svg = Svg.container();
        const pointsToBeConnected = this.getPointsOfLine();

        const headLength =15
        const headWidth =10
        const endOfLine = pointsToBeConnected[pointsToBeConnected.length-1]
        const directionOfEnd = endOfLine.minus(pointsToBeConnected[pointsToBeConnected.length-2]).toUnitVector()
        svg.append(
            Svg.pointerNoFill(endOfLine, directionOfEnd,headLength, headWidth )
        );

        const circleRadius =5
        const startOfLine = pointsToBeConnected[0]
        const directionOfStart = pointsToBeConnected[1].minus(startOfLine).toUnitVector()
        const circleCenter = startOfLine.plus(directionOfStart.muliplied(circleRadius))
        svg.appendChild(
            Svg.circleStroke(circleCenter.x,circleCenter.y,circleRadius,1)
        )
        pointsToBeConnected[0] = startOfLine.plus(directionOfStart.muliplied(circleRadius*2))
        const tipToBase = directionOfEnd.invers().muliplied(headLength)
        pointsToBeConnected[pointsToBeConnected.length-1] = endOfLine.plus(tipToBase)
        svg.append(
            Svg.path(pointsToBeConnected)
        );
        for (const label of this.labels(pointsToBeConnected)) {
            svg.appendChild(label);
        }
        return svg;
    }
}