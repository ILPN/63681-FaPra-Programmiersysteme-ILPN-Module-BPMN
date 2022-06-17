import { BGraph } from './B/BGraph';
import { BpmnEdge } from './Bpmn/BpmnEdge';
import { BpmnEventEnd } from './Bpmn/events/BpmnEventEnd';
import { BpmnEventIntermediate } from './Bpmn/events/BpmnEventIntermediate';
import { BpmnEventStart } from './Bpmn/events/BpmnEventStart';
import { BpmnNode } from './Bpmn/BpmnNode';
import { Svg } from './Svg/Svg';
import { SvgInterface } from './Interfaces/SvgInterface';
import { BpmnGateway } from './Bpmn/gateways/BpmnGateway';

export class BpmnGraph
    extends BGraph<BpmnEdge, BpmnNode>
    implements SvgInterface
{
    constructor(){
        super()
        this._svg = this.updateSvg()
    }
    private _svg: SVGElement;
    getSvg(): SVGElement {
        this.updateSvg();
        return this._svg;
    }
    setSvg(value: SVGElement): void {
        if(this._svg != undefined &&this._svg.isConnected){
            this._svg.replaceWith(value);
        }
        this._svg = value;
    }

    updateSvg(): SVGElement {
        const newSvg = this.createSvg();
        this.setSvg(newSvg)
        return newSvg;
    }
    createSvg() {
        const c = Svg.container()
        c.appendChild(Svg.background())
        for (const n of this.nodes) {
            c.appendChild(n.updateSvg())
        }
        for (const e of this.edges) {
            c.appendChild(e.updateSvg())
        }
        return c
    }

    addNode(node:BpmnNode){
        if(this.nodes.findIndex(n => n.id == node.id) == -1)
            this.nodes.push(node)
            else
            console.log("couldn't add node "+ node.id)

    }

    addEdge(edge:BpmnEdge){
        if(this.edges.findIndex(e => e.id == edge.id) == -1)
            this.edges.push(edge)
        else
        console.log("couldn't add edge "+ edge.id)
    }
 


    static sampleGraph():BpmnGraph{
        const g = new BpmnGraph()
        const node = new BpmnEventStart("TheDude")
        node.label = "start"
        node.setPosXY(100,100)
        g.nodes.push(node)


        const node2 = new BpmnEventIntermediate("TheDude")
        node2.label = "intermediate"
        node2.setPosXY(200,100)
        g.nodes.push(node2)


        const node3 = new BpmnEventEnd("TheDude")
        node3.label = "end"
        node3.setPosXY(300,100)
        g.nodes.push(node3)

        const t1 = new BpmnGateway("TheDude")
        t1.label = "BpmnTaskManual"
        t1.setPosXY(100,200)
        g.nodes.push(t1)


        const e = new BpmnEdge("theEdge",node2,t1)
        e.addArrowCornerXY(100,100)
        g.edges.push(e)

        return g
    }
}
