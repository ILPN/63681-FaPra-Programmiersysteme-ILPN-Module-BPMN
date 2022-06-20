import { BGraph } from '../B/BGraph';
import { BpmnEdge } from './BpmnEdge';
import { BpmnEventEnd } from './events/BpmnEventEnd';
import { BpmnEventIntermediate } from './events/BpmnEventIntermediate';
import { BpmnEventStart } from './events/BpmnEventStart';
import { BpmnNode } from './BpmnNode';
import { Svg } from '../Svg/Svg';
import { SvgInterface } from '../Interfaces/SvgInterface';
import { BpmnGateway } from './gateways/BpmnGateway';
import { BpmnTaskService } from './tasks/BpmnTaskService';
import { BpmnTaskManual } from './tasks/BpmnTaskManual';
import { BpmnTaskUserTask } from './tasks/BpmnTaskUserTask';

export class BpmnGraph
    extends BGraph<BpmnEdge, BpmnNode>
    implements SvgInterface
{
    constructor(){
        super()
        //this._svg = this.updateSvg()
    }
    private _svg: SVGElement | undefined;
    updateSvg(): SVGElement {
        const newSvg = this.createSvg();
        
        if(this._svg != undefined &&this._svg.isConnected){
            this._svg.replaceWith(newSvg);
        }
        this._svg = newSvg;

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
        const g = new BpmnGraph();
        let e1 = new BpmnEventStart("E1");
        e1.label ="Am Start!"
        e1.setPosXY(60,190);
        g.addNode(e1);

        let elementE2 = new BpmnEventIntermediate("E2");
        elementE2.label = "BpmnEventIntermediate"
        elementE2.setPosXY(850,190) ;
        g.addNode(elementE2);



        let elementE3 = new BpmnEventEnd("E3");
        elementE3.setPosXY(1600,190)
        elementE3.label = "BpmnEventEnd"
        g.addNode(elementE3);


        let elementEe3 = new BpmnEventEnd("Ee3");
        elementEe3.setPosXY(1600,190)
        elementEe3.label = "ende gelaende"
        g.addNode(elementEe3);

        let copou = new BpmnEdge("1vvv",elementEe3, elementE3);
        g.addEdge(copou);




        let elementT1 = new BpmnTaskService("t1");
        elementT1.setPosXY(442,60) 
        elementT1.label = "BpmnTaskService"

        g.addNode(elementT1);

        let elementT2 = new BpmnTaskManual("t2");
        elementT2.label = "BpmnTaskService"

        elementT2.setPosXY(442,320);
        g.addNode(elementT2);


     

        let elementT3 = new BpmnTaskUserTask("t3");
        elementT3.label = "BpmnTaskUserTask"

        elementT3.setPosXY(1225,190)
        g.addNode(elementT3);

        let elementG1 = new BpmnGateway("G1");
        elementG1.label = "BpmnGateway"

        elementG1.setPosXY(210,190);
        g.addNode(elementG1);

        let elementG2 = new BpmnGateway("G2");
        elementG2.label = "BpmnGateway"

        elementG2.setPosXY(675,190);
        g.addNode(elementG2);

        let connector = new BpmnEdge("1",e1, elementG1);
        g.addEdge(connector);

        let pfeil = new BpmnEdge("p2", elementG1, elementT1);
        g.addEdge(pfeil);

        let connector2: BpmnEdge = new BpmnEdge("p3",  elementG1, elementT2);
        connector2.addCornerXY(210, 320);

        g.addEdge(connector2);

        let connector3: BpmnEdge = new BpmnEdge("A4",  elementT1, elementG2);
        connector3.addCornerXY(675, 60);
        g.addEdge(connector3);

        let connector4 = new BpmnEdge("A5", elementT2, elementG2);
        connector4.addCornerXY(675, 320);
        g.addEdge(connector4);

        let connector5 = new BpmnEdge("A6", elementG2, elementE2);
        g.addEdge(connector5)

        let connector6 = new BpmnEdge("A7", elementE2, elementT3);
        g.addEdge(connector6)

        let connector7 = new BpmnEdge("A8",  elementT3, elementE3);
        g.addEdge(connector7)

        let connector8 = new BpmnEdge("A9",  elementE3, elementE2);
        connector8.addCornerXY(1600, 60);
        connector8.addCornerXY(850, 60);
        g.addEdge(connector8);

        return g
    }
}
