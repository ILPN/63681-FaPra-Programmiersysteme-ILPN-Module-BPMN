import { BpmnNode } from "../Bpmn/BpmnNode";
import { BpmnEventStart } from "../Bpmn/events/BpmnEventStart";
import { SwitchController } from "./switch-controller";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableNode {
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

        //switch on mouse down
        this._bpmnNode.svgManager.getNewSvg().onmousedown = (e) => controller.press(this)
    }


    predecessors(): Array<SwitchableNode> {
        return this._predecessors
    }

    successors(): Array<SwitchableNode> {
        return this._successors
    }
    addSuccessor(node: SwitchableNode) {
        SwitchUtils.addItem(node, this._successors)
    }

    addPredecessor(node: SwitchableNode) {
        SwitchUtils.addItem(node, this._predecessors)
    }

    get id(): string {
        return this._id
    }

    get bpmnNode(): BpmnNode {
        return this._bpmnNode
    }


    /**
     * collects nodes whose needs to be switched when this node is clicked:
     * 1. nodes after the clicked node
     * 2. nodes before the clicked node
     * @returns 
     */
    switchRegular(): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];

        this._predecessors.forEach(before => { if (before.switchState === SwitchState.enabled) SwitchUtils.addItem(before, nodesToSwitch) });
        this._successors.forEach(after => { if (after.switchState === SwitchState.disabled) SwitchUtils.addItem(after, nodesToSwitch) });

        return nodesToSwitch;
    }

    disabled(): boolean {
        return this._switchState === SwitchState.disabled;
    }
    enableable(): boolean {
        return this.switchState === SwitchState.enableable
    }

    enabled(): boolean {
        return this.switchState === SwitchState.enabled
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

    


    /** disables the node and changes its color */
    disable(): void {
        let oldState: SwitchState = this.switchState
        this.switchState = SwitchState.disabled;
        this.changeColor(oldState, this.switchState);
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

    switch(): void {
        let oldState: SwitchState = this.switchState
        this.setNewState();

        this.changeColor(oldState, this.switchState);

    }

    changeColor(oldState: SwitchState, newState: SwitchState): void {
        this.bpmnNode.svgManager.removeCssClasses(SwitchState[oldState])
        this.bpmnNode.svgManager.setCssClasses(SwitchState[this._switchState]);
    }

    setNewState(): void {
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
    }

}