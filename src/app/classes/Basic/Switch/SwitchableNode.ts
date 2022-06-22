
import { BpmnNode } from "../Bpmn/BpmnNode";
import { BpmnEventStart } from "../Bpmn/events/BpmnEventStart";
import { BpmnGateway } from "../Bpmn/gateways/BpmnGateway";
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";
import { SwitchController } from "./switch-controller";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchableGraph } from "./SwitchableGraph";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableNode implements SvgInterface {
    protected _bpmnNode: BpmnNode
    private _switchState: SwitchState = SwitchState.disabled;
    private _switchController: SwitchController | undefined;
    private _id;
    private _predecessors: Array<SwitchableNode>;
    private _successors: Array<SwitchableNode>;

    constructor(node: BpmnNode, controller: SwitchController) {
        this._bpmnNode = node
        this._switchController = controller;
        if (this.isStartEvent())
            this._switchController.addToStartEvents(this)
        this._id = node.id

        this._predecessors = new Array<SwitchableNode>();
        this._successors = new Array<SwitchableNode>();

    }


    predecessors(): Array<SwitchableNode> {
        return this._predecessors
    }

    successors(): Array<SwitchableNode> {
        return this._successors
    }
    addSuccessor(node: SwitchableNode) {
        if (this._successors.includes(node))
            return
        this._successors.push(node)
    }

    addPredecessor(node: SwitchableNode) {
        if (this._predecessors.includes(node))
            return
        this._predecessors.push(node)
    }

    id(): string {
        return this._id
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
        const svgContainer = Svg.container()
        svgContainer.appendChild(this._bpmnNode.createSvg())

        svgContainer.onmousedown = (event) => {
            this._switchController?.press(this);
        };

        return svgContainer
    }

    /** Diese Methode kann verwendet werden wenn ein Element, alle Elemente von dennen ein Verweis auf das übergebene Element kommt und alle Elemente auf die unser Element zeigt, dem übergebenen Array zum Schalten hinzugefügt werden soll. 
        * @param elementsToSwitch das Array in das das Element aufgenommen werden soll.
        * @param element das Element das hinzugefügt werden soll.
       */
    switchRegular(): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];

        this._predecessors.forEach(before => { if (before.switchState === SwitchState.enabled) SwitchUtils.addNodeToArray(before, nodesToSwitch) });
        this._successors.forEach(after => { if (after.switchState === SwitchState.disabled) SwitchUtils.addNodeToArray(after, nodesToSwitch) });

        return nodesToSwitch;
    }

    disabled(): boolean {
        return this._switchState === SwitchState.disabled;
    }
    enableable(): boolean {
        return this.switchState === SwitchState.enableable
    }

    enabled(): boolean{
        return this.switchState === SwitchState.enabled
    }
    /** disables the node and changes its color */
    disable(): void {
        this.switchState = SwitchState.disabled;
        this.setColorToDefault();
    }

    protected completedPathFromNodeExists(startNode: SwitchableNode): boolean {
        // for (let nodeBefore of this.predecessors()) {
        //     //the immediate predecessor must have state enabled
        //     if(!nodeBefore.enabled())
        //       return false;
            
        //     //every node on the path to the predecessor must be disabled
        //     nodeBefore = nodeBefore.predecessors()[0];
        //     while(nodeBefore != null && nodeBefore != startNode){
                
        //     }
        // }


        // return false;
        return true;
    }


    /** checks if the graph node is a Start Event 
    * @returns true if if the graph node is a Start Event 
    */
    isStartEvent(): boolean {
        if (this._bpmnNode instanceof BpmnEventStart) {
            return true;
        };
        return false;
    }

    isGateway(): boolean {
        return this instanceof SwitchableGateway
    }



    get switchState(): SwitchState {
        return this._switchState;
    }

    set switchState(value: SwitchState) {
        this._switchState = value;
    }

    set switchController(value: SwitchController) {
        this._switchController = value;
    }


    /** set the node color to default  */
    setColorToDefault(): void {
        this._bpmnNode.changeColor(this.getColor())
    }

    private getColor(): string {
        switch (this._switchState) {
            case SwitchState.disabled: {
                return "white";
                break;
            }
            case SwitchState.enableable: {
                return "yellow";
                break;
            }
            case SwitchState.enabled: {
                return "lightgreen";
                break;
            }
            case SwitchState.switched: {
                return "lightgray";
                break;
            }
            default: {
                return "red";
                break;
            }
        }
    }

    switch(): void {
        switch (this._switchState) {
            case SwitchState.disabled: {
                this._switchState = SwitchState.enableable
                break;
            }
            case SwitchState.enableable: {
                this._switchState = SwitchState.enabled;
                break;
            }
            case SwitchState.enabled: {
                this._switchState = SwitchState.switched;
                break;
            }
            case SwitchState.switched: {
                this._switchState = SwitchState.switched;
                break;
            }
            default: {
                this._switchState = SwitchState.disabled
                break;
            }
        }
        this.setColorToDefault();
    }
}