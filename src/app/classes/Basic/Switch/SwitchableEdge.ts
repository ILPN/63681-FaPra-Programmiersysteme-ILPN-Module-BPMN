import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { BpmnEdge, BpmnEdgeCorner } from "../Bpmn/BpmnEdge";
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";
import { SwitchController } from "./switch-controller";

import { SwitchableGraph } from "./SwitchableGraph";

export class SwitchableEdge implements SvgInterface {
    private _edge: BpmnEdge;
    private _switchController: SwitchController | undefined;

    public get edge(): BpmnEdge {
        return this._edge;
    }


    private graph: SwitchableGraph

    constructor(edge: BpmnEdge, graph: SwitchableGraph, controller: SwitchController) {
        this._edge = edge
        this.graph = graph
        this._switchController = controller
    }

    private _svg: SVGElement | undefined;
    updateSvg(): SVGElement {
        const newSvg = this.createSvg();

        if (this._svg != undefined && this._svg.isConnected) {
            this._svg.replaceWith(newSvg);
        }
        this._svg = newSvg;
        return newSvg;
    }
    createSvg(): SVGElement {
        const c = Svg.container()
        c.appendChild(this.edge.createSvg())

        c.appendChild(this.addCircles())
        return c
    }
    addCircles(): SVGElement {
        const c = Svg.container()
        for (let i = 1; i < this.edge.corners.length; i++) {
            let cornerBeforePos = this.edge.corners[i - 1].getPos();
            if (i - 1 == 0) cornerBeforePos = this.edge.nodeIntersection1
            let cornerPos = this.edge.corners[i].getPos();
            if (i == this.edge.corners.length - 1) cornerPos = this.edge.nodeIntersection2


            const pos = Vector.center(cornerBeforePos, cornerPos)
            const plusCircle = Svg.circleNoStyle(pos, "plusCircle")
            Utility.addSimulatedClickListener(plusCircle, () => {
                this.addCorner(i, pos)
            })
            c.appendChild(plusCircle)
        }
        return c
    }
    addCorner(at: number, pos: Vector) {
        const newCorner = this._edge.addCorner(pos, at)

        this.updateSvg()
    }


}