import { BpmnNode } from "../Bpmn/BpmnNode";
import { BpmnEventEnd } from "../Bpmn/events/BpmnEventEnd";
import { BpmnEventStart } from "../Bpmn/events/BpmnEventStart";
import { SwitchController } from "./switch-controller";
import { SwitchState } from "./switchstatetype";
import { SwitchUtils } from "./SwitchUtils";

export class SwitchableNode {
    protected _bpmnNode: BpmnNode
    private _switchState: SwitchState = SwitchState.disabled;
    private _switchController: SwitchController;
    private _id;
    private _predecessors: Array<SwitchableNode>;
    private _successors: Array<SwitchableNode>;

    constructor(node: BpmnNode, controller: SwitchController) {
        this._bpmnNode = node
        this._id = node.id
        this._switchController = controller;

        //initial state for any node except StartEvent is disabled
        //StartEvents are enableable
        this.switchTo(SwitchState.disabled)
        if (this.isStartEvent())
            this._switchController.addToStartEvents(this)

        //connected nodes
        this._predecessors = new Array<SwitchableNode>();
        this._successors = new Array<SwitchableNode>();

        //switch state on mouse down
        this._bpmnNode.svgManager.getNewSvg().onmousedown = (e) => controller.press(this)
    }

    containsOutEdges(): boolean {
        return this._bpmnNode.outEdges.length > 0;
    }

    containsInEdges() {
        return this._bpmnNode.inEdges.length > 0;
    }


    get predecessors(): Array<SwitchableNode> {
        return this._predecessors
    }

    get successors(): Array<SwitchableNode> {
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
     * 1. disabled nodes after the clicked node
     * 2. enabled nodes before the clicked node
     * @returns nodes to switch
     */
    switchRegular(): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        SwitchUtils.addItem(this, nodesToSwitch)
        this._predecessors.forEach(before => {
            SwitchUtils.addItems(before.classicAllNodesBeforeToSwitch(), nodesToSwitch);
        });
        this._successors.forEach(after => {
            if (after.disabled() || after.switched()) SwitchUtils.addItem(after, nodesToSwitch)
        });

        return nodesToSwitch;
    }

    /**
     * collects this node and all nodes before which must be switched
     * @returns nodes to switch
     */
    classicAllNodesBeforeToSwitch(): SwitchableNode[] {
        let nodesToSwitch: SwitchableNode[] = [];
        if (this.enableable() || this.switchedButEnableForLoopRun() || this.enabled()) {
            SwitchUtils.addItem(this, nodesToSwitch);
            this._predecessors.forEach(before => {
                SwitchUtils.addItems(before.classicAllNodesBeforeToSwitch(), nodesToSwitch);
            }
            )
        };
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

    switchedButEnableForLoopRun(): boolean {
        return this.switchState === SwitchState.switchedButEnableForLoopRun
    }


    /**
     * checks if this node is a gateway
     * @returns
     */
    isGateway(): boolean {
        //we have to move the implementation to another class
        //because importing SwitchableGateway in this class
        // creates circular dependency because of which webpack refuses to build the project
        return SwitchUtils.isGateway(this);
    }

    /**
     * checks if this node is in state switched
     * @returns
     */
    switched(): boolean {
        return this.switchState === SwitchState.switched
    }

    /** checks if the graph node is a Start Event
     * @returns true if if the graph node is a Start Event
     */
    isStartEvent(): boolean {
        return this._bpmnNode instanceof BpmnEventStart;
    }

    /** checks if the graph node is an End Event
     * @returns true if the graph node is an End Event
     */
    isEndEvent(): boolean {
        return this._bpmnNode instanceof BpmnEventEnd;
    }

    /** disables the node and changes its color */
    enable(): void {
        if (this.switchState === SwitchState.disabled) {
            this.switchTo(SwitchState.enableable)
        } else {
            this.switchTo(SwitchState.switchedButEnableForLoopRun)
        }
    }

    /** disables the node and changes its color */
    disable(): void {
        if (this.switchState === SwitchState.switchedButEnableForLoopRun) {
            this.switchTo(SwitchState.switched)
        } else {
            this.switchTo(SwitchState.disabled)
        }
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

    get switchController(): SwitchController {
        return this._switchController;
    }

    /**
     * switches state to the next one according to transition rules
     */
    switch(): void {
        this.switchTo(this.getNextState())
    }

    /**
     * switches node to specified new state
     * @param newState
     */
    switchTo(newState: SwitchState): void {
        this.changeColor(this.switchState, newState)
        this.switchState = newState;
    }

    /**
     * sets new color according to the new state
     */
    changeColor(oldState: SwitchState, newState: SwitchState): void {
        this.bpmnNode.svgManager.removeCssClasses(SwitchState[oldState])
        this.bpmnNode.svgManager.setCssClasses(SwitchState[newState]);
        this.bpmnNode.svgManager.redraw();

    }

    /**
     * defines the transition to the next state from the current state
     * @returns the next state to switch to
     */
    getNextState(): SwitchState {
        switch (this._switchState) {
            case SwitchState.disabled:
                return SwitchState.enableable

            case SwitchState.enableable:
                return SwitchState.enabled;

            case SwitchState.enabled:
                return SwitchState.switched;

            case SwitchState.switched:
                return SwitchState.switchedButEnableForLoopRun; // For loops

            case SwitchState.switchedButEnableForLoopRun:
                return SwitchState.enabled; // For loops

            default:
                return SwitchState.disabled

        }

    }

}
