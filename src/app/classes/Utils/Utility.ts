export class Utility{
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
}
