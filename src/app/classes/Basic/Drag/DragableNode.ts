import { BpmnNode } from "../Bpmn/BpmnNode";
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";
import { DragHandle } from "./DragHandle";
import { DragWrapperGraph } from "./DragWrapperGraph";

export class DragableNode implements SvgInterface{
    private node:BpmnNode
    private dwg:DragWrapperGraph
    private _dragHandle: DragHandle
    public get dragHandle(): DragHandle {
        return this._dragHandle;
    }
    constructor(node:BpmnNode, dwg:DragWrapperGraph){
        this.node = node
        this.dwg = dwg
        this._dragHandle = new DragHandle(node)
        this.dragHandle.addCallbackAfterDrag(() =>{
            this.updateSvg()
        })
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
    createSvg():SVGElement{
        const c = Svg.container()
        c.appendChild(this.node.createSvg())
        c.onmousedown = (e)=> this.dwg.startDrag(e, this.dragHandle)
        return c
    }
}