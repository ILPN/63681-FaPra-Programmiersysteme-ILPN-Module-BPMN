import { Vector } from "./Vector";

export class Utility{
    static cutSet<T>(set1: T[], set2:T[]) {
        return set1.filter(n => set2.includes(n))
   }
    static substractArray<T>(set: T[], substraction:T[]) {
         return set.filter(n => !substraction.includes(n))
    }
    static lastElement(arr:any[]) {
        return arr[arr.length-1]
        }
    
    static between(n: number, lowLimit: number, highLimit: number) {
        return (lowLimit <= n)&& (n <= highLimit);
    }

     static createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

    static addSimulatedClickListener(svg:SVGElement, onCLick: (e:MouseEvent)=>void ){
        let mouseDown = false
        svg.onmousedown =(e) => mouseDown = true
        svg.onmouseup =(e) => {
           if (mouseDown)onCLick(e)
       }
       svg.onmouseleave =(e) =>mouseDown = false
   }

   static pushIfNotInArray<T>( toBePushed:T, arr:T[]):boolean{
        if(arr.findIndex(o => o == toBePushed) != -1) return false
        arr.push(toBePushed)
        return true

   }

   static removeAllChildren(svg:SVGElement){
      if (svg?.childElementCount === undefined) {
          return;
      }
      while (svg.childElementCount > 0) {
          svg.removeChild(svg.lastChild as ChildNode);
      }
   }
}
