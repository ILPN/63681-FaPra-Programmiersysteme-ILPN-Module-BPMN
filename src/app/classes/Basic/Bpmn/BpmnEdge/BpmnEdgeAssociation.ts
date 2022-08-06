import { Vector } from "src/app/classes/Utils/Vector";
import { Svg } from "../../Svg/Svg";
import { BpmnEdge } from "./BpmnEdge";

export class BpmnEdgeAssociation extends BpmnEdge{
    override svgCreation(): SVGElement {
        const svg = Svg.container();
        const pointsToBeConnected = this.getPointsOfLine();
        svg.append(
            Svg.path(pointsToBeConnected)
        );
        for (const label of this.labels(pointsToBeConnected)) {
            svg.appendChild(label);
        }
        return svg;
    }
}