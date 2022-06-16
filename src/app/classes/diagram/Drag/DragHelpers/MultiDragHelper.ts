import { Element } from "../../element";
import { DragHelper } from "./DragHelper";
import { DragHelperInterface } from "./DragHelperInterface";

export class MultiDragHelper implements DragHelperInterface<Element>{

    private helpers: DragHelper<Element>[] = []

    addDragHelper(helper: DragHelper<Element>,){
        this.helpers.push(helper)
    }

    dragElement(e: MouseEvent): void {
        for (const helper of this.helpers) {
            helper.dragElement(e)
        }
    }
    startDrag( event: MouseEvent): void {
        for (const helper of this.helpers) {
            helper.startDrag(event)
        }
    }
    stopDrag(): void {
        for (const helper of this.helpers) {
            helper.stopDrag()
        }
    }

}