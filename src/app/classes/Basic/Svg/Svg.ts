export class Svg{
    static logoManual(): any {
        let path = this.createSvgElement('path');
        //initial width is 10 and height 7.1759
        //path.setAttribute("transform",`translate (${x}, ${y}) scale(${width/10})`)
        path.setAttribute("d" , `m0.47178 0 4.5877 2.8285 4.5877-2.8285zm-0.47178 0.44312v6.5079c0 0.12383 0.10104 0.22487 0.22487 0.22487h9.5503c0.12383 0 0.22487-0.10104 0.22487-0.22487v-6.4065l-4.7354 2.9497c-0.00239 0.00238-0.00858 0.00638-0.010998 0.00882-0.00235 0.00236-0.00639 0.00417-0.00884 0.00661-0.00714 0.00477-0.010507 0.00625-0.017613 0.011025-0.00239 0.00233-0.00639 0.00197-0.00884 0.00441-0.00956 0.00477-0.019162 0.010658-0.028687 0.015432-0.00235 2e-7 -0.00416 0.0022-0.00661 0.0022-0.00952 0.00474-0.017121 0.00638-0.024227 0.00882-0.00239 0-0.00635 0.0022-0.00884 0.0022-0.00711 0-0.014929 0.00417-0.022072 0.00661-0.00239 0-0.00635 0.0022-0.00884 0.0022-0.00711 0.00233-0.017121 0.00441-0.024227 0.00441h-0.00661c-0.00956 0.00244-0.021317 0.0022-0.030841 0.0022-0.00956 0-0.021317-0.0022-0.030841-0.0022h-0.00661c-0.00714-0.00233-0.017121-0.00197-0.024227-0.00441-0.00235 0-0.00858-0.0022-0.010998-0.0022-0.00711 0-0.012699-0.00417-0.019843-0.00661-0.00235 0-0.00858-0.0022-0.010998-0.0022-0.00952-0.00238-0.014891-0.00638-0.022072-0.00882-0.00235 0-0.00635-0.0022-0.00884-0.0022-0.00956-0.00477-0.019162-0.010658-0.028687-0.015432-0.00235-0.00233-0.00416-0.00197-0.00661-0.00441-0.00714-0.00239-0.010507-0.00625-0.017613-0.011025-0.00239-0.00236-0.00858-0.00417-0.010998-0.00661-0.00235-0.00238-0.00635-0.00638-0.00884-0.00882z`)

        return path;
    }
    static logoSending(x:number, y:number, width:number=20): any {
        let path = this.createSvgElement('path');
        //initial width is 10 and height 7.1759
        path.setAttribute("transform",`translate (${x}, ${y}) scale(${width/10})`)
        path.setAttribute("d" , `m0.47178 0 4.5877 2.8285 4.5877-2.8285zm-0.47178 0.44312v6.5079c0 0.12383 0.10104 0.22487 0.22487 0.22487h9.5503c0.12383 0 0.22487-0.10104 0.22487-0.22487v-6.4065l-4.7354 2.9497c-0.00239 0.00238-0.00858 0.00638-0.010998 0.00882-0.00235 0.00236-0.00639 0.00417-0.00884 0.00661-0.00714 0.00477-0.010507 0.00625-0.017613 0.011025-0.00239 0.00233-0.00639 0.00197-0.00884 0.00441-0.00956 0.00477-0.019162 0.010658-0.028687 0.015432-0.00235 2e-7 -0.00416 0.0022-0.00661 0.0022-0.00952 0.00474-0.017121 0.00638-0.024227 0.00882-0.00239 0-0.00635 0.0022-0.00884 0.0022-0.00711 0-0.014929 0.00417-0.022072 0.00661-0.00239 0-0.00635 0.0022-0.00884 0.0022-0.00711 0.00233-0.017121 0.00441-0.024227 0.00441h-0.00661c-0.00956 0.00244-0.021317 0.0022-0.030841 0.0022-0.00956 0-0.021317-0.0022-0.030841-0.0022h-0.00661c-0.00714-0.00233-0.017121-0.00197-0.024227-0.00441-0.00235 0-0.00858-0.0022-0.010998-0.0022-0.00711 0-0.012699-0.00417-0.019843-0.00661-0.00235 0-0.00858-0.0022-0.010998-0.0022-0.00952-0.00238-0.014891-0.00638-0.022072-0.00882-0.00235 0-0.00635-0.0022-0.00884-0.0022-0.00956-0.00477-0.019162-0.010658-0.028687-0.015432-0.00235-0.00233-0.00416-0.00197-0.00661-0.00441-0.00714-0.00239-0.010507-0.00625-0.017613-0.011025-0.00239-0.00236-0.00858-0.00417-0.010998-0.00661-0.00235-0.00238-0.00635-0.00638-0.00884-0.00882z`)

        return path;
    }
    static rectRounded(x:number, y:number, width: number = 50, height: number =50, radius:number = 10, strokeWidth = 2): string | Node {
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
        circle.setAttribute('r', `${radius}`);
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
    static container(){
        const c = Svg.createSvgElement('svg');
        c.setAttribute('style', "overflow: visible;");
        return c;
    }
    static relativeContainer(x:number, y:number){
        const c = Svg.createSvgElement('svg');
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