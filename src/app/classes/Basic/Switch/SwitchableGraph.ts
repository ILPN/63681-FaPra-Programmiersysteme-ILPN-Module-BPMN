import { BpmnEdge } from '../Bpmn/BpmnEdge/BpmnEdge';
import { BpmnGraph } from '../Bpmn/BpmnGraph';
import { BpmnNode } from '../Bpmn/BpmnNode';
import { BpmnGateway } from '../Bpmn/gateways/BpmnGateway';
import { GetSvgManager } from '../Interfaces/GetSvgManager';
import { Svg } from '../Svg/Svg';
import { SvgManager } from '../Svg/SvgManager/SvgManager';
import { SwitchController } from './switch-controller';
import { SwitchableEdge } from './SwitchableEdge';
import { SwitchableGateway } from './SwitchableGateway';
import { SwitchableNode } from './SwitchableNode';
import { SwitchUtils } from './SwitchUtils';


export class SwitchableGraph implements GetSvgManager {

    private _switchEdges: SwitchableEdge[] = []
    private _switchNodes: SwitchableNode[] = []
    private _controller: SwitchController;

    constructor(bpmnGraph: BpmnGraph) {

        //controls how nodes are switched
        this._controller = new SwitchController(this);

        bpmnGraph.edges.forEach((bpmnEdge: BpmnEdge) => {
            let switchEdge: SwitchableEdge = new SwitchableEdge(bpmnEdge);
            SwitchUtils.addItem(switchEdge, this._switchEdges);
            this.addNodesConnectedByEdge(bpmnEdge, this._controller);

        })
    }

    get controller(): SwitchController {
        return this._controller
    }

    getNode(id: string): any {
        for (let node of this._switchNodes)
            if (node.id === id)
                return node
        return null
    }

    svgCreation(): SVGElement {
        const svgContainer = Svg.container();
        const svgNodes = Svg.container('nodes');
        const svgEdges = Svg.container('edges');


        for (let switchNode of this._switchNodes) {
            svgNodes.appendChild(switchNode.bpmnNode.svgManager.getSvg());
        }

        for (let switchEdge of this._switchEdges) {
            svgEdges.appendChild(switchEdge.bpmnEdge.svgManager.getSvg());
        }

        svgContainer.appendChild(svgNodes);
        svgContainer.appendChild(svgEdges);
        return svgContainer;
    }


    addNewSwitchNode(bpmnNode: BpmnNode, controller: SwitchController): SwitchableNode {
        let node = (bpmnNode instanceof BpmnGateway) ? new SwitchableGateway(bpmnNode, controller) : new SwitchableNode(bpmnNode, controller);
        SwitchUtils.addItem(node, this._switchNodes);
        return node;
    }

    addNodesConnectedByEdge(edge: BpmnEdge, controller: SwitchController): void {
        //create node that is source of the edge
        let switchNodeFrom: SwitchableNode = this.getSwitchNode(edge.from);
        if (switchNodeFrom == null)
            switchNodeFrom = this.addNewSwitchNode(edge.from, controller);

        //create node that is target of the edge
        let switchNodeTo: SwitchableNode = this.getSwitchNode(edge.to);
        if (switchNodeTo == null)
            switchNodeTo = this.addNewSwitchNode(edge.to, controller);

        //register predecessor and successor nodes   
        switchNodeTo.addPredecessor(switchNodeFrom);
        switchNodeFrom.addSuccessor(switchNodeTo);
    }

    private getSwitchNode(nodeToFind: BpmnNode): any {

        for (let node of this._switchNodes)
            if (node.id === nodeToFind.id)
                return node
        return null
    }

    get switchNodes(): SwitchableNode[] {
        return this._switchNodes
    }



    private _svgManager: SvgManager | undefined;
    public get svgManager(): SvgManager {
        if (this._svgManager == undefined) {
            this._svgManager = new SvgManager("SwitchableGraph", () => this.svgCreation())
        }
        return this._svgManager;
    }



}
