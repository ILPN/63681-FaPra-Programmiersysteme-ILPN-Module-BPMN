import { Vector } from "../../Utils/Vector";

export class Svg {
    static textFrom(text:string, pos:Vector,rotation:number =0, baseline:string= "middle", anchor:string = "left",dx:number =5, dy:number=-5, fontSize:number =12){
        const txt = this.createSvgElement('text');
        txt.setAttribute('x', 0+"");
        txt.setAttribute('y', 0+"");
        txt.setAttribute('dx', dx+"");
        txt.setAttribute('dy', dy+"");
        txt.setAttribute("transform",`translate(${pos.x} ${pos.y}) rotate(${rotation}) `)
        txt.setAttribute('font-size', `${fontSize}px`);
        txt.setAttribute('text-align', 'justified');
        txt.setAttribute('line-height', '110%');
        txt.setAttribute('dominant-baseline', baseline);
        txt.setAttribute('text-anchor', anchor);
        let textNode = document.createTextNode(text);
        txt.appendChild(textNode);
        return txt;
    }
    static dummyNode(pos: Vector): SVGElement {
        return Svg.circleNoStyle(pos, 10, "dummyNode")
    }
    static event(pos: Vector, radius: number, label: string) {
        const c = Svg.relativeContainerWithClass(pos, "Event")
        c.append(Svg.circleNoStyle(new Vector(0, 0), radius, "nodeBackground"))
        c.appendChild(this.getText(label, 0, radius + 15, 12, 2))
        return c
    }
    static gateway(pos: Vector, width: number, label: string) {
        const g = this.relativeContainerWithClass(pos, "Gateway")
        g.appendChild(this.rotatetSquare(0, 0, width))
        g.appendChild(Svg.getText(label, 0, width / 2 + 15, 12, 2))
        // g.appendChild(this.image(iconUrl,dimen.half().invers().plus(new Vector(10,10))))
        return g
    }
    static task(pos: Vector, dimen: Vector, label: string, iconUrl: string) {
        const g = this.relativeContainerWithClass(pos, "Task")
        g.appendChild(this.rectRounded(dimen.half().invers(), dimen))
        g.appendChild(Svg.getText(label, 0, 0,))
        g.appendChild(this.image(iconUrl, dimen.half().invers().plus(new Vector(10, 10))))
        return g
    }
    static circleNoStyleNoRadius(pos: Vector, cssClass?: string) {
        const cir = Svg.createSvgElement('circle');
        cir.setAttribute('cx', pos.x.toString());
        cir.setAttribute('cy', pos.y.toString());
        if (cssClass) cir.setAttribute("class", cssClass)
        return cir;
    }
    static circleNoStyle(pos: Vector, radius: number, cssClass?: string) {
        const cir = Svg.createSvgElement('circle');
        cir.setAttribute('cx', pos.x.toString());
        cir.setAttribute('cy', pos.y.toString());
        cir.setAttribute('r', radius + "");

        if (cssClass) cir.setAttribute("class", cssClass)
        return cir;
    }


    static empty(): SVGElement {
        return this.createSvgElement("svg")
    }
    static pointer(position: Vector, direction: Vector) {
        const headLength = 15;
        const headWidth = 10;
        const half = headWidth / 2

        const pointerPath = `m 0,0 ${half},${headLength} ${-headWidth},${0}`

        const pointer = this.createSvgElement('path');
        pointer.setAttribute(
            'd',
            pointerPath
        );
        //pointer.setAttribute("transform",`translate(0 0) rotate(${direction.radians()}rad)`)
        const deg = direction.toUnitVector().degree().toFixed(1);
        pointer.setAttribute("transform", `translate(${position.x} ${position.y}) rotate(${deg}) `)
        //translate(${position.x} ${position.y})
        pointer.setAttribute(
            'style',
            `fill:#000000;stroke:none;stroke-width:0px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1`
        );
        return pointer
    }
    static path(pointsToBeConnected: Vector[]) {
        let pathSvg = this.createSvgElement('path');
        pathSvg.setAttribute(
            'style',
            `fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`
        );
        let pathString = 'M ';
        for (const point of pointsToBeConnected) {
            pathString = pathString + `${point.x},${point.y} `;
        }
        pathSvg.setAttribute('d', pathString);
        return pathSvg
    }
    static pathNoStyle(pointsToBeConnected: Vector[], cssClass?: string) {
        let pathSvg = this.createSvgElement('path');
        if (cssClass) pathSvg.classList.add(cssClass)
        let pathString = 'M ';
        for (const point of pointsToBeConnected) {
            pathString = pathString + `${point.x},${point.y} `;
        }
        pathSvg.setAttribute('d', pathString);
        return pathSvg
    }
    private static readonly strokeWidth = 3
    static rotatetSquare(x: number, y: number, diagonal: number = 50): SVGElement {
        const width = Math.sqrt(diagonal * diagonal / 2)
        let rect = this.createSvgElement('rect');
        rect.classList.add("nodeBackground")
        rect.setAttribute('x', `${x - width / 2}`);
        rect.setAttribute('y', `${y - width / 2}`);
        rect.setAttribute('width', `${width}`);
        rect.setAttribute('height', `${width}`);
        rect.setAttribute('rx', `${2}`);
        rect.setAttribute('ry', `${2}`);
        rect.setAttribute("transform", "translate(0 0) rotate(45)")
        return rect;
    }

    private static readonly logoWidth = 15

    static image(url: string, pos: Vector, width: number = this.logoWidth) {
        const img = this.createSvgElement("image")
        img.setAttribute('x', pos.x.toString());
        img.setAttribute('y', pos.y.toString());
        img.setAttribute('width', width + "");
        //img.setAttribute('onload', "SVGInject(this)");
        img.setAttribute('href', url);
        return img
    }
    static rectRounded(pos: Vector, dimen: Vector = new Vector(100, 50), radius: number = 10, strokeWidth = 2): SVGElement {
        let rect = this.createSvgElement('rect');
        rect.classList.add("nodeBackground")
        rect.setAttribute('x', `${pos.x}`);
        rect.setAttribute('y', `${pos.y}`);
        rect.setAttribute('width', `${dimen.x}`);
        rect.setAttribute('height', `${dimen.y}`);
        rect.setAttribute('rx', `${radius}`);
        rect.setAttribute('ry', `${radius}`);
        return rect;
    }

    static createSvgElement(name: string): SVGElement {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    static circleStroke(x: number, y: number, radius: number, strokeWidth = 3) {
        const circle = Svg.createSvgElement('circle');
        circle.classList.add("stroke")
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', `${radius - strokeWidth / 2}`);
        circle.setAttribute(
            'style',
            `stroke-width:${strokeWidth}px;`
        );
        return circle;
    }

    static circle(pos: Vector, radius: number) {
        const circle = Svg.createSvgElement('circle');
        circle.setAttribute('cx', pos.x.toString());
        circle.setAttribute('cy', pos.y.toString());
        circle.setAttribute('r', `${radius}`);
        circle.setAttribute(
            'style',
            `stroke:none;
            fill:black`
        );
        return circle;
    }
    static container(id?: string) {
        const c = Svg.createSvgElement('svg');
        if (id) c.setAttribute('id', id);
        c.setAttribute('style', "overflow: visible;");
        return c;
    }
    static relativeContainer(x: number, y: number, id?: string) {
        const c = Svg.createSvgElement('svg');
        if (id) c.setAttribute('id', id);
        c.setAttribute("x", x + "")
        c.setAttribute("y", y + "")
        c.setAttribute('style', "overflow: visible;");
        return c;
    }

    static relativeContainerWithClass(pos: Vector, cssClass: string) {
        const c = Svg.createSvgElement('svg');
        c.classList.add(cssClass)
        c.setAttribute("x", pos.x + "")
        c.setAttribute("y", pos.y + "")
        c.setAttribute('style', "overflow: visible;");
        return c;
    }

    static text(text: string, x: number = 0, y: number = 0, fontSize: number = 12) {
        const txt = this.createSvgElement('text');
        txt.setAttribute('x', x + "");
        txt.setAttribute('y', y + "");
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

    static getText(text: string, x: number = 0, y: number = 0, fontSize: number = 12, maxZeilen: number = 4): SVGElement {
        let txt = this.createSvgElement('text');
        txt.setAttribute('x', `${x}`);
        txt.setAttribute('y', `${y}`);
        txt.setAttribute('font-size', `${fontSize}px`);
        txt.setAttribute('text-align', 'justified');
        txt.setAttribute('line-height', '110%');
        txt.setAttribute('dominant-baseline', 'middle');
        txt.setAttribute('text-anchor', 'middle');

        let A = Svg.splitString(text);


        if (A.length > maxZeilen) {
            A = A.slice(0, maxZeilen - 1);
            A.push("...");
        }
        let yCalculation: number = y - (6 * (A.length - 1));
        A.forEach(s => {
            let textNode = Svg.newTSpan(`${s}`, x, yCalculation);
            yCalculation = yCalculation + (fontSize + 3);
            txt.appendChild(textNode);
        });
        return txt;

    }

    static newTSpan(text: string, x: number, y: number): SVGElement {
        let tspan = this.createSvgElement('tspan');
        tspan.setAttribute("x", `${x}`);
        tspan.setAttribute("y", `${y}`);
        tspan.textContent = text;
        return tspan;
    }

    static splitString(text: String): Array<string> {
        let A: Array<string> = text.split(" ");
        let B: Array<string> = [""];
        let i: number = 0;
        let j: number = 0;
        let splitAfter: number = 15;
        let index: number = 0;

        A.forEach(Atte => {
            if ((B[j].length + Atte.length) > splitAfter) {
                if (Atte.length > splitAfter) {
                    for (index = 0; (Atte.length - index) > splitAfter; index = index + splitAfter) {
                        B[j] = B[j] + " " + Atte.substring(index, index + splitAfter) + "-";
                        j++;
                        B.push("");
                    }
                    B[j] = B[j] + " " + Atte.substring(index, index + splitAfter);
                } else {
                    j++;
                    B.push("");
                    B[j] = B[j] + " " + Atte;
                }
            } else {
                B[j] = B[j] + " " + Atte;
            }
        });
        return B;
    }

}
