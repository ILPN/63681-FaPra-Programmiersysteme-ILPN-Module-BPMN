import { BpmnGraph } from "../Bpmn/BpmnGraph";
import { DraggableGraph } from "../Drag/DraggableGraph";
import { SvgInterface } from "../Interfaces/SvgInterface";
import { Svg } from "../Svg/Svg";


export class ReorderGraph implements SvgInterface{
    constructor(bpmnGraph:BpmnGraph, rootSvg:SVGElement){
        this.bpmnGraph = bpmnGraph
        this.attachListenersForDragging(rootSvg)
    }
    attachListenersForDragging(rootSvg: SVGElement) {
        rootSvg.onmouseup = (event) => {
            this.stopDrag(event);
        };
        rootSvg.onmousemove = (event) => {
            this.drag(event);
        };
    }
    startDrag(){}
    drag(e:MouseEvent){}
    stopDrag(e:MouseEvent){
    }

    private bpmnGraph:BpmnGraph 
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
        const c = Svg.container("ReorderGraph")

        return c
    }

}
