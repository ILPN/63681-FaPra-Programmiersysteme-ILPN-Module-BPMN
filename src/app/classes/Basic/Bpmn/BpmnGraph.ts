import {BGraph} from '../B/BGraph';
import {BpmnEdge} from './BpmnEdge/BpmnEdge';
import {BpmnEventEnd} from './events/BpmnEventEnd';
import {BpmnEventIntermediate} from './events/BpmnEventIntermediate';
import {BpmnEventStart} from './events/BpmnEventStart';
import {BpmnNode} from './BpmnNode';
import {Svg} from '../Svg/Svg';
import {BpmnGateway} from './gateways/BpmnGateway';
import {BpmnTaskService} from './tasks/BpmnTaskService';
import {BpmnTaskManual} from './tasks/BpmnTaskManual';
import {BpmnTaskUserTask} from './tasks/BpmnTaskUserTask';
import {GetSvgManager} from '../Interfaces/GetSvgManager';
import {SvgManager} from '../Svg/SvgManager/SvgManager';
import {BpmnGatewayJoinAnd} from './gateways/BpmnGatewayJoinAnd';
import {BpmnGatewaySplitAnd} from './gateways/BpmnGatewaySplitAnd';
import {BpmnGatewaySplitOr} from './gateways/BpmnGatewaySplitOr';
import {BpmnGatewayJoinOr} from './gateways/BpmnGatewayJoinOr';
import {BpmnGatewaySplitXor} from './gateways/BpmnGatewaySplitXor';
import {BpmnGatewayJoinXor} from './gateways/BpmnGatewayJoinXor';
import {BpmnTaskBusinessRule} from './tasks/BpmnTaskBusinessRule';
import {BpmnEdgeDefault} from './BpmnEdge/BpmnEdgeDefault';
import {ValidateableGraph} from "../Interfaces/ValidateableGraph";
import { BpmnEdgeMessageflow } from './BpmnEdge/BpmnEdgeMessageflow';
import { BpmnEdgeAssociation } from './BpmnEdge/BpmnEdgeAssociation';

export class BpmnGraph
    extends BGraph<BpmnEdge, BpmnNode>
    implements GetSvgManager, ValidateableGraph {
    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if (this._svgManager == undefined) {
            this._svgManager = new SvgManager("BpmnGraph", () => this.svgCreation())
        }
        return this._svgManager;
    }

    constructor() {
        super()
        //this._svg = this.updateSvg()
    }

    isValidateable(): boolean {
        return true;
    }

    private svgCreation() {
        const c = Svg.container()
        for (const n of this.nodes) {
            c.appendChild(n.svgManager.getNewSvg())
        }
        for (const e of this.edges) {
            c.appendChild(e.svgManager.getNewSvg())
        }
        return c
    }

    addNode(node: BpmnNode) {
        if (this.nodes.findIndex(n => n.id == node.id) == -1)
            this.nodes.push(node)
       // else
           // console.log("couldn't add node " + node.id)
    }

    addEdge(edge: BpmnEdge) {
        const fromNode = this.nodes.find(n => n == edge.from)
        const toNode = this.nodes.find(n => n == edge.to)
        if (fromNode == undefined || toNode == undefined) throw new Error("couldn find nodes of edge")

        if (this.edges.findIndex(e => e.id == edge.id) == -1) {
            fromNode.addOutEdge(edge)
            toNode.addInEdge(edge)
            this.edges.push(edge)
        } //else
            //console.log("couldn't add edge " + edge.id)
    }


    static sampleGraph(): BpmnGraph {
        const g = new BpmnGraph();
        let e1 = new BpmnEventStart("E1");
        e1.label = "Am Start!"
        e1.setPosXY(60, 190);
        g.addNode(e1);

        let elementE2 = new BpmnEventIntermediate("E2");
        elementE2.label = "BpmnEventIntermediate"
        elementE2.setPosXY(850, 190);
        g.addNode(elementE2);


        let elementE3 = new BpmnEventEnd("E3");
        elementE3.setPosXY(1600, 190)
        elementE3.label = "BpmnEventEnd"
        g.addNode(elementE3);


        let elementEe3 = new BpmnEventEnd("Ee3");
        elementEe3.setPosXY(1600, 190)
        elementEe3.label = "ende gelaende"
        g.addNode(elementEe3);

        let copou = new BpmnEdge("1vvv", elementEe3, elementE3);
        g.addEdge(copou);


        let elementT1 = new BpmnTaskService("t1");
        elementT1.setPosXY(442, 60)
        elementT1.label = "BpmnTaskService"

        g.addNode(elementT1);

        let elementT2 = new BpmnTaskManual("t2");
        elementT2.label = "BpmnTaskService"

        elementT2.setPosXY(442, 320);
        g.addNode(elementT2);

        let tb2 = new BpmnTaskBusinessRule("tb2");
        tb2.label = "BpmnTaskBusinessRule"
        g.addNode(tb2);


        let elementT3 = new BpmnTaskUserTask("t3");
        elementT3.label = "BpmnTaskUserTask"

        elementT3.setPosXY(1225, 190)
        g.addNode(elementT3);

        // ---------------------------------------------------

        // let elementG1 = new BpmnGatewaySplitAnd("G1");
        // elementG1.label = "BpmnGateway"

        // elementG1.setPosXY(210,190);
        // g.addNode(elementG1);

        // let elementG2 = new BpmnGatewayJoinAnd("G2");
        // elementG2.label = "BpmnGateway"

        // ---------------------------------------------------

        let elementG1 = new BpmnGatewaySplitOr("G1");
        elementG1.label = "BpmnGateway"

        elementG1.setPosXY(210, 190);
        g.addNode(elementG1);

        let elementG2 = new BpmnGatewayJoinOr("G2");
        elementG2.label = "BpmnGateway"


        // ---------------------------------------------------

        // let elementG1 = new BpmnGatewaySplitXor("G1");
        // elementG1.label = "BpmnGateway"

        // elementG1.setPosXY(210,190);
        // g.addNode(elementG1);

        // let elementG2 = new BpmnGatewayJoinXor("G2");
        // elementG2.label = "BpmnGateway"

        // ---------------------------------------------------
        elementG2.setPosXY(675, 190);
        g.addNode(elementG2);

        let connector = new BpmnEdge("1", e1, elementG1);
        g.addEdge(connector);

        let pfeil = new BpmnEdge("p2", elementG1, elementT1);
        g.addEdge(pfeil);

        let connector2: BpmnEdge = new BpmnEdgeMessageflow("p3", elementG1, elementT2);
        connector2.addCornerXY(210, 320);

        g.addEdge(connector2);

        let connector3: BpmnEdge = new BpmnEdgeAssociation("A4", elementT1, elementG2);
        connector3.addCornerXY(675, 60);
        g.addEdge(connector3);

        let connector4 = new BpmnEdge("A5", elementT2, elementG2);
        connector4.addCornerXY(675, 320);
        g.addEdge(connector4);

        let connector5 = new BpmnEdgeDefault("A6", elementG2, elementE2);
        g.addEdge(connector5)

        let connector6 = new BpmnEdge("A7", elementE2, elementT3);
        g.addEdge(connector6)

        let connector7 = new BpmnEdge("A8", elementT3, elementE3);
        g.addEdge(connector7)
        connector7.labelStart = "One"
        connector7.labelEnd = "Three"

        let connector8 = new BpmnEdge("A9", elementE3, elementE2);
        connector8.addCornerXY(1600, 60);
        connector8.addCornerXY(850, 60);
        connector8.labelStart = "Start"
        connector8.labelMid = "Mid"
        connector8.labelEnd = "End"
        g.addEdge(connector8);

        return g
    }

    static anotherGraph(): BpmnGraph {
        const g = new BpmnGraph();
        let e1 = new BpmnEventStart("E1");
        e1.label = "Start"

        g.addNode(e1);

        let elementE2 = new BpmnEventIntermediate("E2");
        elementE2.label = "BpmnEventIntermediate"
        g.addNode(elementE2);


        let elementE3 = new BpmnEventEnd("E3");
        elementE3.label = "BpmnEventEnd"
        g.addNode(elementE3);


        let elementT1 = new BpmnTaskService("t1");
        elementT1.setPosXY(442, 60)
        elementT1.label = "BpmnTaskService mit der ID T1 und damit der Name noch länger wird schreibe ich diesen Text hier"

        g.addNode(elementT1);

        let elementT2 = new BpmnTaskManual("t2");
        elementT2.label = "BpmnTaskService  mit der ID T2 und extra langen Namen"

        elementT2.setPosXY(442, 320);
        g.addNode(elementT2);


        let elementT3 = new BpmnTaskUserTask("t3");
        elementT3.label = "BpmnTaskUserTask"

        elementT3.setPosXY(1225, 190)
        g.addNode(elementT3);

        // ---------------------------------------------------

        // let elementG1 = new BpmnGatewaySplitAnd("G1");
        // elementG1.label = "BpmnGateway"

        // elementG1.setPosXY(210,190);
        // g.addNode(elementG1);

        // let elementG2 = new BpmnGatewayJoinAnd("G2");
        // elementG2.label = "BpmnGateway"

        // ---------------------------------------------------

        let elementG1 = new BpmnGatewaySplitOr("G1");
        elementG1.label = "G1 ist ein Oder Split Gateway"
        g.addNode(elementG1);

        let elementG2 = new BpmnGatewayJoinOr("G2");
        elementG2.label = "G2 ist ein Oder Join Gateway mit zu langem Namen"


        // ---------------------------------------------------

        // let elementG1 = new BpmnGatewaySplitXor("G1");
        // elementG1.label = "BpmnGateway"

        // elementG1.setPosXY(210,190);
        // g.addNode(elementG1);

        // let elementG2 = new BpmnGatewayJoinXor("G2");
        // elementG2.label = "BpmnGateway"

        // ---------------------------------------------------
        elementG2.setPosXY(675, 190);
        g.addNode(elementG2);


        let connector = new BpmnEdge("1", e1, elementG1);
        g.addEdge(connector);


        let connector2: BpmnEdge = new BpmnEdge("p3", elementG1, elementT2);
        connector2.addCornerXY(210, 320);

        g.addEdge(connector2);


        let elementG3 = new BpmnGatewaySplitXor("G3");
        elementG3.label = "G3";
        g.addNode(elementG3);

        let elementG4 = new BpmnGatewayJoinXor("G4");
        elementG4.label = "G4"
        g.addNode(elementG4);

        let connector9: BpmnEdge = new BpmnEdge("A9", elementG1, elementT1);
        g.addEdge(connector9);

        let connector10: BpmnEdge = new BpmnEdge("A10", elementT1, elementG3);
        g.addEdge(connector10);


        let elementT10 = new BpmnTaskService("t10");
        elementT10.label = "t10";
        g.addNode(elementT10);

        let elementT11 = new BpmnTaskManual("t11");
        elementT11.label = "t11"
        g.addNode(elementT11);

        let connector11: BpmnEdge = new BpmnEdge("A11", elementG3, elementT10);
        g.addEdge(connector11);

        let connector12: BpmnEdge = new BpmnEdge("A12", elementG3, elementT11);
        g.addEdge(connector12);

        let connector13: BpmnEdge = new BpmnEdge("A13", elementT10, elementG4);
        g.addEdge(connector13);

        let connector14: BpmnEdge = new BpmnEdge("A14", elementT11, elementG4);
        g.addEdge(connector14);

        let connector15: BpmnEdge = new BpmnEdge("A15", elementG4, elementG2);
        g.addEdge(connector15);


        let connector4 = new BpmnEdge("A5", elementT2, elementG2);
        connector4.addCornerXY(675, 320);
        g.addEdge(connector4);

        let connector5 = new BpmnEdge("A6", elementG2, elementE2);
        g.addEdge(connector5)

        let connector6 = new BpmnEdge("A7", elementE2, elementT3);
        g.addEdge(connector6)

        let connector7 = new BpmnEdge("A8", elementT3, elementE3);
        g.addEdge(connector7)


        return g
    }

    static miniGraph(): BpmnGraph {
        const g = new BpmnGraph()

        const start = new BpmnEventStart("start")
        start.label = "start"
        g.addNode(start)

        const start2 = new BpmnEventStart("start2")
        start2.label = "start2"
        g.addNode(start2)

        const middle = new BpmnEventIntermediate("middle")
        start.label = "middle"
        g.addNode(middle)

        const end = new BpmnEventEnd("end")
        start.label = "end"
        g.addNode(end)


        const e1 = new BpmnEdge("startToMiddle",start,middle)
        g.addEdge(e1)
        const e2 = new BpmnEdge("middleToEnd",middle,end)
        g.addEdge(e2)
        const e3 = new BpmnEdge("EndToStart",end,start)
        g.addEdge(e3)

        const e4 = new BpmnEdge("Start2ToEnd",start2,end)
        g.addEdge(e4)

        return g
    }


    private addMyEvent(id: string, typ: string): void {
        if (typ === "BpmnEventStart") {
            let e1 = new BpmnEventStart(id);
            e1.label = id;
            this.addNode(e1);
        } else {
            if (typ === "BpmnEventIntermediate") {
                let e1 = new BpmnEventIntermediate(id);
                e1.label = id;
                this.addNode(e1);
            } else {
                let e1 = new BpmnEventEnd(id);
                e1.label = id;
                this.addNode(e1);
            }
        }
    }


    private addMyTask(id: string): void {
        let elementT1 = new BpmnTaskService(id);
        elementT1.label = id;
        this.addNode(elementT1);
    }

    private addMyGateway(id: string, mode: string, typ: string): void {
        let gateway = new BpmnGateway(id);
        if (mode === "split" && typ === "or") gateway = new BpmnGatewaySplitOr(id);
        if (mode === "join" && typ === "or") gateway = new BpmnGatewayJoinOr(id);
        if (mode === "split" && typ === "and") gateway = new BpmnGatewaySplitAnd(id);
        if (mode === "join" && typ === "and") gateway = new BpmnGatewayJoinAnd(id);
        if (mode === "split" && typ === "xor") gateway = new BpmnGatewaySplitXor(id);
        if (mode === "join" && typ === "xor") gateway = new BpmnGatewayJoinXor(id);
        gateway.label = id
        this.addNode(gateway);
    }


    private addMyConnector(fromID: string, toID: string) {
        let fromNode: BpmnNode | undefined = this.getNodeFromID(fromID);
        let toNode: BpmnNode | undefined = this.getNodeFromID(toID);
        if (fromNode !== undefined && toNode !== undefined) {
            let connector: BpmnEdge = new BpmnEdge("A-" + fromNode.id + "-" + toNode.id, fromNode, toNode);
            this.addEdge(connector);
        }
    }
    private addMyConnectorDefaultEdge(fromID: string, toID: string) {
        let fromNode: BpmnNode | undefined = this.getNodeFromID(fromID);
        let toNode: BpmnNode | undefined = this.getNodeFromID(toID);
        if (fromNode !== undefined && toNode !== undefined) {
            let connector: BpmnEdge = new BpmnEdgeDefault("A-" + fromNode.id + "-" + toNode.id, fromNode, toNode);
            connector.labelMid = "center"
            connector.labelEnd = "end"
            
            this.addEdge(connector);
        }
    }

    getNodeFromID(toID: string): BpmnNode | undefined {
        let answer: BpmnNode | undefined = undefined;
        this.nodes.forEach(node => {
            if (node.id === toID) answer = node;
        });
        //  throw new Error('ID unknown');
        if (answer === undefined) console.error("ID unknown: " + toID);
        return answer;
    }

    private allOrGatewayForAnotherMonsterGraph() {
        this.addMyGateway("G1J", "join", "or");
        this.addMyGateway("G2S", "split", "or");
        this.addMyGateway("G2J", "join", "or");
        this.addMyGateway("G3S", "split", "or");
        this.addMyGateway("G3J", "join", "or");
        this.addMyGateway("G4S", "split", "or");
        this.addMyGateway("G4J", "join", "or");
        this.addMyGateway("G5S", "split", "or");
        this.addMyGateway("G5J", "join", "or");
        this.addMyGateway("G6S", "split", "or");
        this.addMyGateway("G6J", "join", "or");
        this.addMyGateway("G7S", "split", "or");
        this.addMyGateway("G7J", "join", "or");
    }

    private mixedGatewayForAnotherMonsterGraph() {
        this.addMyGateway("G1J", "join", "or");
        this.addMyGateway("G2S", "split", "or");
        this.addMyGateway("G2J", "join", "or");
        this.addMyGateway("G3S", "split", "and");
        this.addMyGateway("G3J", "join", "and");
        this.addMyGateway("G4S", "split", "or");
        this.addMyGateway("G4J", "join", "or");
        this.addMyGateway("G5S", "split", "and");
        this.addMyGateway("G5J", "join", "and");
        this.addMyGateway("G6S", "split", "xor");
        this.addMyGateway("G6J", "join", "xor");
        this.addMyGateway("G7S", "split", "or");
        this.addMyGateway("G7J", "join", "or");
    }

    static anotherMonsterGraph(): BpmnGraph {
        const g = new BpmnGraph();

        g.addMyEvent("E1", "BpmnEventStart");
        g.addMyEvent("E2", "BpmnEventStart");
        g.addMyEvent("E3", "BpmnEventEnd");

        g.addMyTask("T1");
        g.addMyTask("T2");
        g.addMyTask("T3");
        g.addMyTask("T4");
        g.addMyTask("T5");
        g.addMyTask("T6");
        g.addMyTask("T7");
        g.addMyTask("T8");
        g.addMyTask("T9");
        g.addMyTask("T10");
        g.addMyTask("T11");
        g.addMyTask("T12");
        g.addMyTask("T13");
        g.addMyTask("T14");
        g.addMyTask("T15");
        g.addMyTask("T16");

        // g.allOrGatewayForAnotherMonsterGraph();
        g.mixedGatewayForAnotherMonsterGraph();


        g.addMyConnectorDefaultEdge("E1", "T1");
        g.addMyConnector("T1", "G1J");
        g.addMyConnector("E2", "G1J");
        g.addMyConnector("G1J", "T2");
        g.addMyConnector("T2", "G2S");

// split G2S 1
        g.addMyConnector("G2S", "T3");
        g.addMyConnector("T3", "G3S");
        g.addMyConnector("G3S", "T6");


        // split G3S 1
        g.addMyConnector("T6", "G6S");
        g.addMyConnector("G6S", "T7");
        g.addMyConnector("G6S", "T8");
        g.addMyConnector("T7", "T15");
        g.addMyConnector("T8", "T16");
        g.addMyConnector("T15", "G6J");
        g.addMyConnector("T16", "G6J");
        g.addMyConnector("G6J", "G3J");
        // split G3S 2
        g.addMyConnector("G3S", "T9");
        g.addMyConnector("T9", "G7S");
        g.addMyConnector("G7S", "T10");
        g.addMyConnector("G7S", "T11");
        g.addMyConnector("T10", "G7J");
        g.addMyConnector("T11", "G7J");
        g.addMyConnector("G7J", "G3J");


// split G2S 2

        g.addMyConnector("G2S", "G4S");
        g.addMyConnector("G4S", "T4");
        g.addMyConnector("T4", "T12");
        g.addMyConnector("T12", "G4J");

        g.addMyConnector("G4S", "T5");
        g.addMyConnector("T5", "G5S");
        g.addMyConnector("G5S", "T13");
        g.addMyConnector("G5S", "T14");
        g.addMyConnector("T13", "G5J");
        g.addMyConnector("T14", "G5J");
        g.addMyConnector("G5J", "G4J");


        g.addMyConnector("G3J", "G2J");
        g.addMyConnector("G4J", "G2J");
        g.addMyConnector("G2J", "E3");
        return g
    }


    static loopingLouieGraph(): BpmnGraph {
        const g = new BpmnGraph();

        g.addMyEvent("E1", "BpmnEventStart");
        g.addMyEvent("E2", "BpmnEventEnd");

        g.addMyTask("T1");
        g.addMyTask("T2");
        g.addMyTask("T3");
        g.addMyTask("T4");

        g.addMyGateway("G1J", "join", "xor");
        g.addMyGateway("G1S", "split", "xor");
        g.addMyGateway("G2S", "split", "or");
        g.addMyGateway("G2J", "join", "or");


        g.addMyConnector("E1", "T1");
        g.addMyConnector("T1", "G1J");
        g.addMyConnector("G1J", "T2");
        g.addMyConnector("T2", "G2S");
        g.addMyConnector("G2S", "T3");
        g.addMyConnector("G2S", "T4");
        g.addMyConnector("T3", "G2J");
        g.addMyConnector("T4", "G2J");


        g.addMyConnector("G2J", "G1S");
        g.addMyConnector("G1S", "G1J");
        g.addMyConnector("G1S", "E2");

        g.addMyConnector("G2S", "G2J");

        return g
    }

    public getNode(id: string): BpmnNode | undefined {
        return this.nodes.find(node => node.id === id)
    }

}
