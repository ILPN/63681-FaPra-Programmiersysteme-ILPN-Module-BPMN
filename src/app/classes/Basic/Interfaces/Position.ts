import { Vector } from "../../Utils/Vector"

export interface Position{
    getPos():Vector
    setPos(pos:Vector):void
    setPosXY(x: number, y: number):void


    get x():number
    get y(): number

    set x(value:number)
    set y(value:number)


}