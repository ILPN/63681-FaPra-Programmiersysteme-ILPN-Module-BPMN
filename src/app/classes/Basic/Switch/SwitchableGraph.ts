import { exists } from 'fs';
import { BpmnEdge } from '../Bpmn/BpmnEdge';
import { BpmnGraph } from '../Bpmn/BpmnGraph';
import { BpmnNode } from '../Bpmn/BpmnNode';
import { SvgInterface } from '../Interfaces/SvgInterface';
import { Svg } from '../Svg/Svg';
import { SwitchController } from './switch-controller';
import { SwitchableEdge } from './SwitchableEdge';
import { SwitchableNode } from './SwitchableNode';


export class SwitchableGraph implements SvgInterface {
    private bpmnGraph: BpmnGraph;
    private switchEdges: SwitchableEdge[] = []
    private _switchNodes: SwitchableNode[] = []
    constructor(bpmnGraph: BpmnGraph) {
        this.bpmnGraph = bpmnGraph;
        //logic to switch nodes
        const controller = new SwitchController(this);

        this.switchEdges = bpmnGraph.edges.map((bpmnEdge: BpmnEdge) => {
            const switchableEdge = new SwitchableEdge(bpmnEdge, this, controller)
            addNodeFrom(bpmnEdge.from, bpmnEdge, controller);
            addNodeTo(bpmnEdge.to, bpmnEdge, controller)


            return switchableEdge
        })

        // this._switchNodes = bpmnGraph.nodes.map((n: BpmnNode,i: any)=>{
        //     const switchableNode = new SwitchableNode(n,this, controller)
        //     const outDEdges = this.switchEdges.filter((sEdge)=> sEdge.edge.from == n)
        //     // for (const switchableEdge of outDEdges) {
        //     //     switchableNode.dragHandle.addDraggedAlong(switchableEdge.getStartCornerDragHandle())
        //     // }

        //     // const inDEdges = this.switchEdges.filter((dE)=> dE.edge.to == n)
        //     // for (const switchableEdge of inDEdges) {
        //     //     switchableNode.dragHandle.addDraggedAlong(switchableEdge.getEndCornerDragHandle())
        //     // }

        //     return switchableNode
        // })
    }

    addNodeFrom(nodeFrom: BpmnNode, edge: BpmnEdge, controller: SwitchController): void {
        let switchNode: SwitchableNode = this.getSwitchNode(nodeFrom);
        if (switchNode == null)
            switchNode = this.addNewSwitchNode(nodeFrom, controller);
        
        switchNode.addSuccessor(edge.to); 
    }

    addNewSwitchNode(bpmnNode: BpmnNode, controller: SwitchController): SwitchableNode{
        let switchNode = new SwitchableNode(bpmnNode, controller);
        this._switchNodes.push(switchNode);

        return switchNode;
    }

    addNodeTo(nodeTo: BpmnNode, edge: BpmnEdge, controller: SwitchController): void {
        let switchNode: SwitchableNode = this.getSwitchNode(nodeTo);
        if (switchNode == null)
            switchNode = this.addNewSwitchNode(nodeTo, controller);
        
        switchNode.addPredecessor(edge.to); 
    }

    private getSwitchNode(nodeToCheck: BpmnNode): any {

        for (let node of this._switchNodes)
            if (node.id() === nodeToCheck.id)
                return node
        return null
    }

    get switchNodes(): SwitchableNode[] {
        return this._switchNodes
    }

    private snapSvgs: SVGElement | undefined;
    updateSvg(): SVGElement {
        const c = Svg.container();
        const cNodes = Svg.container('nodes');
        const cEdges = Svg.container('edges');

        c.appendChild(Svg.background());

        // c.onmouseup = (event) => {
        //     this.stopDrag(event);
        // };
        // c.onmousemove = (event) => {
        //     this.drag(event);
        // };

        for (const n of this._switchNodes) {
            cNodes.appendChild(n.updateSvg());
        }


        for (const e of this.switchEdges) {
            cEdges.appendChild(e.updateSvg());
        }

        this.snapSvgs = Svg.container('snapSvgs');
        c.appendChild(cNodes);
        c.appendChild(this.snapSvgs);
        c.appendChild(cEdges);
        return c;
    }


}
