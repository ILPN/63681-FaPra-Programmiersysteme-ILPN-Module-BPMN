import { BGraph } from './B/BGraph';
import { BpmnEdge } from './Bpmn/BpmnEdge';
import { BpmnEventEnd } from './Bpmn/events/BpmnEventEnd';
import { BpmnEventIntermediate } from './Bpmn/events/BpmnEventIntermediate';
import { BpmnEventStart } from './Bpmn/events/BpmnEventStart';
import { BpmnNode } from './Bpmn/BpmnNode';
import { Svg } from './Svg/Svg';
import { SvgInterface } from './SvgInterface';
import { BpmnTask } from './Bpmn/tasks/BpmnTask';
import { BpmnTaskSending } from './Bpmn/tasks/BpmnTaskSending';
import { BpmnTaskManual } from './Bpmn/tasks/BpmnTaskManual';
import { BpmnTaskReceiving } from './Bpmn/tasks/BpmnTaskReceiving';
import { BpmnTaskUserTask } from './Bpmn/tasks/BpmnTaskUserTask';
import { BpmnTaskService } from './Bpmn/tasks/BpmnTaskService';

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
            c.appendChild(n.getSvg())
        }
        return c
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

        const t1 = new BpmnTaskService("TheDude")
        t1.label = "BpmnTaskManual"
        t1.setPosXY(100,200)
        g.nodes.push(t1)


        return g
    }
}
