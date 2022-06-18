import { Vector } from "src/app/classes/Utils/Vector"

export  abstract class SnapElement{    
    snap(toBeSnaped:Vector):Vector{
        if(!this.shouldBeSnaped(toBeSnaped)) return toBeSnaped
        else return this.snapTo(toBeSnaped)   
    }
    protected abstract shouldBeSnaped(toBeSnaped:Vector):boolean
    protected abstract snapTo(toBeSnaped:Vector):Vector
    abstract createSVG():SVGElement
}