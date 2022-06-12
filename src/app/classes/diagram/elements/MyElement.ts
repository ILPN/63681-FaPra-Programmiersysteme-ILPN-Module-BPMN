export class MyElement{
    private domSVG: SVGElement|undefined
    getSvgWithListeners(): SVGElement {
        const svg = this.createSvg()
        svg.onmousedown = (event) =>{
            console.log("mouse down of "+ this.id)
            this.x = this.x +20
            this.y = this.y +20
            this.updateSvg()

        }
        this.domSVG = svg

        return svg
    }
    updateSvg() {
        if(this.domSVG == undefined )return
        this.domSVG.replaceWith(this.getSvgWithListeners())
    }
    constructor(id:string){
        this.id = id
    }
    public id = ""
    public x = 0
    public y = 0
    public width = 30
    public height = 30
    public createSvg():SVGElement{
        let wrapper = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        wrapper.setAttribute('width', `${this.width}`);
        wrapper.setAttribute('height', `${this.height}`);
        wrapper.setAttribute('x', `${this.x - this.width / 2}`);
        wrapper.setAttribute('y', `${this.y - this.height / 2}`);
        wrapper.setAttribute('style', 'overflow: visible;');

        let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        rect.setAttribute('width', `${this.width}`);
        rect.setAttribute('height', `${this.height}`);
        rect.setAttribute('stroke', 'rgb(0,0,0)');
        rect.setAttribute('stroke-width', `${10}`);
        rect.setAttribute('fill', 'white');
        rect.setAttribute('transform', 'rotate(-45 ' + `${(this.width / 2)}` + ' ' + `${this.height / 2}` + ')');

        wrapper.append(rect)

        return wrapper
    }
}