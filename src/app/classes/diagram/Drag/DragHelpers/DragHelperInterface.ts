 export interface DragHelperInterface<T>{
    dragElement(e: MouseEvent):void
    startDrag(event:MouseEvent):void
    stopDrag():void;
 }