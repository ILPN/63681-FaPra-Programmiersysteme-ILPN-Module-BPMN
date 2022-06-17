import { Vector } from "../../Utils/Vector";

export class Svg{
    private static readonly strokeWidth = 3
    static rotatetSquare(x:number, y:number, diagonal: number = 50):SVGElement {
        const width = Math.sqrt(diagonal*diagonal/2)
        let rect = this.createSvgElement('rect');
        rect.setAttribute('x', `${x-width/2}`);
        rect.setAttribute('y', `${y-width/2}`);

        rect.setAttribute('width', `${width}`);
        rect.setAttribute('height', `${width}`);
        rect.setAttribute('rx', `${2}`);
        rect.setAttribute('ry', `${2}`);
        rect.setAttribute("transform","translate(0 0) rotate(45)")

        rect.setAttribute(
            'style',
            `
            stroke:rgb(0, 0, 0);
            stroke-width:${this.strokeWidth}px;
            fill:white
            `
        );
        return rect;
    }

    private static readonly logoWidth = 15

static image(url:string, x:number,y:number,width:number=this.logoWidth){
    const img = this.createSvgElement("image")
    img.setAttribute('x', x.toString());
    img.setAttribute('y', y.toString());
    img.setAttribute('width', width+"");
    //img.setAttribute('onload', "SVGInject(this)");
    img.setAttribute('href', url);
    return img
}
    static rectRounded(x:number, y:number, width: number = 50, height: number =50, radius:number = 10, strokeWidth = 2):SVGElement {
        let rect = this.createSvgElement('rect');
        rect.setAttribute('x', `${x-width/2}`);
        rect.setAttribute('y', `${y-height/2}`);

        rect.setAttribute('width', `${width}`);
        rect.setAttribute('height', `${height}`);
        rect.setAttribute('rx', `${radius}`);
        rect.setAttribute('ry', `${radius}`);
        rect.setAttribute(
            'style',
            `
            stroke:rgb(0, 0, 0);
            stroke-width:${strokeWidth}px;
            fill:white
            `
        );
        return rect;
    }
    static background() {
        const b = this.createSvgElement('rect');
        b.setAttribute('width', `100%`);
        b.setAttribute('height', `100%`);
        b.classList.add('background');
        return b
    }
    
    static createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    static circleStroke(x:number,y:number,radius:number,strokeWidth =3){
        const circle = Svg.createSvgElement('circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', `${radius-strokeWidth/2}`);
        circle.setAttribute(
            'style',
            `
            stroke:rgb(0, 0, 0);
            stroke-width:${strokeWidth}px;
            fill:white
            `
        );
        return circle;
    }
    static container(id?:string){
        const c = Svg.createSvgElement('svg');
        if(id) c.setAttribute('id', id);
        c.setAttribute('style', "overflow: visible;");
        return c;
    }
    static relativeContainer(x:number, y:number, id?:string){
        const c = Svg.createSvgElement('svg');
        if(id) c.setAttribute('id', id);
        c.setAttribute("x", x+"")
        c.setAttribute("y", y+"")
        c.setAttribute('style', "overflow: visible;");
        return c;
    }

    static text(text:string, x:number=0, y: number=0, fontSize:number =12){
        const txt = this.createSvgElement('text');
        txt.setAttribute('x', x+"");
        txt.setAttribute('y', y+"");
        txt.setAttribute('font-size', `${fontSize}px`);
        txt.setAttribute('text-align', 'justified');
        txt.setAttribute('line-height', '110%');
        txt.setAttribute('dominant-baseline', 'middle');
        txt.setAttribute('text-anchor', 'middle');
        //text.setAttribute("transform","translate(0 0) rotate(90)")
        let textNode = document.createTextNode(text);
        txt.appendChild(textNode);
        return txt;
    }
}