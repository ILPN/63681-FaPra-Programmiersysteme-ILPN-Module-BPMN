import { SnapElement } from "../../diagram/Drag/SnapElements/SnapElement";
import { Utility } from "../../Utils/Utility";
import { Vector } from "../../Utils/Vector";
import { Position } from "../Interfaces/Position";
import { Svg } from "../Svg/Svg";

export class DragHandle<T extends Position>{
    private doAfterDrag: ()=>any = ()=>{console.log("no afterDrag callback")}
    addCallback(afterDrag: () => void) {
       this.doAfterDrag = afterDrag;
    }
    protected dragedElement:T
    constructor(dragedElement:T,){
        this.dragedElement = dragedElement
     }

    addDraggedAlong(dragedAlong:DragHandle<Position>){
        if(dragedAlong.dragedElement == this.dragedElement) return
        Utility.pushIfNotInArray<DragHandle<Position>>(dragedAlong, this.dragedAlong)
    }
    
    private snapElements: SnapElement[] = []
    public addSnapElement(snapElement: SnapElement){
        this.snapElements.push(snapElement)
    }
    private snapSvg:SVGElement | undefined
    /**
     * 
     * @returns svg representing where drag will snap to
     */
    getSnapSvg(){
       const svg = Svg.container()
       svg.id = "snapSvgs"
       for (const snapEl of this.snapElements) {
        svg.appendChild(snapEl.createSVG())
       }
       this.snapSvg = svg
       return svg
    }

    draging(e: MouseEvent) {
        const currentMousePos = new Vector( e.clientX, e.clientY)
        const delta = currentMousePos.minus(this.mouseStartPos)
        
        let newPos = this.startPos.plus(delta)

        for (const snapElement of this.snapElements) {
            newPos = snapElement.snap(newPos)
        }
        const deltaEL = newPos.minus(this.startPos)
        //only call onDrag if position is changing
        if (!newPos.equals(this.dragedElement.getPos())){
            this.onDrag(deltaEL)
        }
    }


   protected onDrag(delta:Vector):void{
    const newPos = this.startPos.plus(delta)
    this.dragedElement.setPos(newPos)
    for (const dh of this.dragedAlong) {
        dh.onDrag(delta)
    }

    this.doAfterDrag()
    
   }

    private dragedAlong:DragHandle<Position>[] =[]

    protected startPos: Vector = new Vector();

    private mouseStartPos:Vector = new Vector()

    startDrag(event:MouseEvent){
        this.startPos = this.dragedElement.getPos()
        this.mouseStartPos.x = event.clientX
        this.mouseStartPos.y = event.clientY
        for (const dragHandle of this.dragedAlong) {
            dragHandle.startDrag(event)
        }
    }
    stopDrag(){
        this.snapSvg?.remove()
        this.snapElements =[]
        for (const dragHandle of this.dragedAlong) {
            dragHandle.stopDrag()
        }
    }

}