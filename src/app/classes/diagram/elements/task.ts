import { Element } from "../element";
import { TaskType } from "./tasktype";

export class Task extends Element {
    private _label: string;
    private _type: TaskType;
    private _width: number = 170; // width 170
    private _height: number = 100; // height 100
    private _rounding: number = 10; // Abrunden
    private _border: number = 2;
    private _myScale: number = 1;

    constructor(id: string, label: string, type: TaskType) {
        super(id);
        this._label = label;
        this._type = type;
        this.distanceX = this._width / 2;
        this.distanceY = this._height / 2;
    }

    public get type(): TaskType {
        return this._type;
    }
    public set type(value: TaskType) {
        this._type = value;
    }

    public get label(): string {
        return this._label;
    }
    public set label(value: string) {
        this._label = value;
    }



    public createSvg(): SVGElement {
        const svg = this.createUndergroundSVG();
        svg.append(this.createRect());
        svg.append(this.createTypeSvg());
        svg.append(this.getText());
        this.registerSvg(svg);
        return svg;
    }


    private createUndergroundSVG(): SVGElement {
        let svg = this.createSvgElement('svg');
        svg.setAttribute('width', `${this._width + 2 * this._border}`);
        svg.setAttribute('height', `${this._height + 2 * this._border}`);
        svg.setAttribute('viewBox', "0 0 " + `${this._width + 2 * this._border}` + " " + `${this._height + 2 * this._border}`);
        svg.setAttribute('preserveAspectRatio', "xMidYMid meet");
        svg.setAttribute('x', `${this.x - ((this._width + 2 * this._border) / 2)}`);
        svg.setAttribute('y', `${this.y - ((this._height + 2 * this._border) / 2)}`);
        return svg;
    }

    private createRect(): SVGElement {
        let rect = this.createSvgElement('rect');
        rect.setAttribute('id', 'rect1');
        rect.setAttribute('width', `${this._width}`);
        rect.setAttribute('height', `${this._height}`);
        rect.setAttribute('x', `${this._border}`);
        rect.setAttribute('y', `${this._border}`);
        rect.setAttribute('rx', `${this._rounding}`);
        rect.setAttribute('ry', `${this._rounding}`);
        rect.setAttribute('stroke', 'rgb(0,0,0)');
        rect.setAttribute('stroke-width', `${this._border}`);
        rect.setAttribute('fill', 'white');
        this.addSVGtoColorChange(rect);
        return rect;
    }

    /** Bekommt eine Number übergeben und wandelt sie in einen String um. Es wird ebenfalls ein Komma durch einen Punkt ersetzt. */
    private replaceNumberToString(zahl: number) {
        return zahl.toString().replace(/,/gi, '.');
    }


    private createTypeSvg(): SVGElement {
        // Erzeuge einen leeren default Path.
        let type_svg = this.createSvgElement('path');
        //  Sending, Manual, Service, BusinessRule, Receiving, UserTask
        if (this._type === TaskType.Sending) return this.getTypeSending();
        if (this._type === TaskType.Manual) return this.getTypeManual();
        if (this._type === TaskType.Service) return this.getTypeService();
        if (this._type === TaskType.BusinessRule) return this.getTypeBusinessRule();
        if (this._type === TaskType.Receiving) return this.getTypeReceiving();
        if (this._type === TaskType.UserTask) return this.getTypeUserTask();
        return type_svg; // default
    }

    private getTypeSending(): SVGElement {
        let type_svg = this.createSvgElement('svg');
        let type_rect = this.createSvgElement('rect');
        let scaleString: String = this.replaceNumberToString(0.05 * this._myScale);
        type_rect.setAttribute('x', `20.7`);
        type_rect.setAttribute('y', `23.4`);
        type_rect.setAttribute('width', `429.3`);
        type_rect.setAttribute('height', `311.5`);
        type_rect.setAttribute('fill', `black`);
        type_rect.setAttribute('transform', 'translate(8 8) scale(' + `${scaleString}` + ')');
        type_svg.append(type_rect);
        let type_path = this.createSvgElement('path');
        type_path.setAttribute("id", "pathIdD");
        type_path.setAttribute("d", "M437.5,0h-401C16.4,0,0,16.4,0,36.5v282.4c0,20.1,16.4,36.5,36.5,36.5h401c20.1,0,36.5-16.4,36.5-36.5V36.5 C474,16.4,457.6,0,437.5,0z M432.2,27L239.5,145.8L46.8,27H432.2z M447,318.9c0,5.2-4.3,9.5-9.5,9.5h-401c-5.2,0-9.5-4.3-9.5-9.5 V45.6l203.7,128.2c0.1,0.1,0.3,0.2,0.4,0.3c0.1,0.1,0.3,0.2,0.4,0.3c0.3,0.2,0.5,0.4,0.8,0.5c0.1,0.1,0.2,0.1,0.3,0.2 c0.4,0.2,0.8,0.4,1.2,0.6c0.1,0,0.2,0.1,0.3,0.1c0.3,0.1,0.6,0.3,1,0.4c0.1,0,0.3,0.1,0.4,0.1c0.3,0.1,0.6,0.2,0.9,0.2  c0.1,0,0.3,0.1,0.4,0.1c0.3,0.1,0.7,0.1,1,0.2c0.1,0,0.2,0,0.3,0c0.4,0,0.9,0.1,1.3,0.1l0,0l0,0c0.4,0,0.9,0,1.3-0.1 c0.1,0,0.2,0,0.3,0c0.3,0,0.7-0.1,1-0.2c0.1,0,0.3-0.1,0.4-0.1c0.3-0.1,0.6-0.2,0.9-0.2c0.1,0,0.3-0.1,0.4-0.1 c0.3-0.1,0.6-0.2,1-0.4c0.1,0,0.2-0.1,0.3-0.1c0.4-0.2,0.8-0.4,1.2-0.6c0.1-0.1,0.2-0.1,0.3-0.2c0.3-0.2,0.5-0.3,0.8-0.5 c0.1-0.1,0.3-0.2,0.4-0.3c0.1-0.1,0.3-0.2,0.4-0.3L447,49.9V318.9z");
        type_path.setAttribute("stroke", "white");
        type_path.setAttribute("opacity", "1");
        type_path.setAttribute("fill", "white");
        type_path.setAttribute('transform', 'translate(8 8) scale(' + `${scaleString}` + ')');
        type_svg.append(type_path);
        this.addSVGtoColorChange(type_path);
        return type_svg;
    }

    private getTypeManual(): SVGElement {
        let scaleString: String = this.replaceNumberToString(0.06 * this._myScale);
        let type_svg = this.createSvgElement('path');
        type_svg.setAttribute("id", "pathIdD");
        type_svg.setAttribute("d", "M351.9,250.6c5.2-5.2,8-12.1,8-19.4c0-6-1.9-11.6-5.4-16.3l0.5,0c15.1,0,27.4-12.3,27.4-27.4c0-14.1-10.7-25.8-24.4-27.3 " +
            "c3.5-4.6,5.5-10.3,5.5-16.5c0-7.3-2.9-14.2-8-19.4c-5.2-5.2-12.1-8-19.4-8l-110-1c4.6-5.5,7.1-12.4,7.1-19.7 " +
            "c0-12.2-10-22.2-22.2-22.2l-72.1,1c-13.1,0-34.8,9.5-64.4,28.3c-21.6,13.7-39.8,27.6-40,27.7c-1.4,1.1-2.2,2.7-2.2,4.4l0,146 " +
            "c0,1.5,0.6,2.9,1.6,3.9c1,1,2.4,1.6,3.9,1.6l3.2,0c11.7,0,23.2,1.7,34.4,4.9c12.2,3.6,24.8,5.4,37.6,5.4l152.4,0 " +
            "c6.5,0,12.7-2.5,17.3-7.2c4.7-4.7,7.3-11,7.2-17.7c-0.1-4.8-1.6-9.3-4.1-13l46.4,0C339.8,258.6,346.7,255.8,351.9,250.6z " +
            " M332.5,247.5l-130.5,0c-3.1,0-5.6,2.5-5.6,5.6c0,1.5,0.6,2.9,1.6,3.9c1,1,2.4,1.6,3.9,1.6l63.3,0c7.5,0,13.7,5.9,13.8,13.2 " +
            "c0.1,3.7-1.3,7.1-3.9,9.7c-2.5,2.5-5.9,3.9-9.5,3.9l-152.4,0c-11.7,0-23.2-1.7-34.4-4.9c-11.4-3.3-23.3-5.1-35.2-5.4l0-137.7 " +
            "c21.3-16,73.9-52.1,95.4-52.1l72.1-1c6.1,0,11.1,5,11.1,11.1c0,5.3-2.1,10.2-5.8,14c-3.7,3.7-8.7,5.8-14,5.8l-59.6,0 " +
            "c-3.1,0-5.6,3.5-5.6,6.6c0,1.5,0.6,2.9,1.6,3.9s2.4,1.6,3.9,1.6l59.6,0c0,0,0,0,0,0l133.7,0c4.4,0,8.5,1.7,11.6,4.8 " +
            "c3.1,3.1,4.8,7.2,4.8,11.6c0,9-7.3,16.3-16.3,16.3l-113.7,0c-3.1,0-5.6,2.5-5.6,5.6c0,1.9,1,3.6,2.5,4.6c0.9,0.6,2,0.9,3.1,0.9 " +
            "l132.5,0c9,0,16.3,7.3,16.3,16.3c0,9-7.3,16.3-16.3,16.3l-141.7,0c-3.1,0-5.6,2.5-5.6,5.6c0,3.1,2.5,5.6,5.6,5.6l119.1,0 " +
            "c4.4,0,8.5,1.7,11.6,4.8c3.1,3.1,4.8,7.2,4.8,11.6c0,4.4-1.7,8.5-4.8,11.6C341,245.8,336.9,247.5,332.5,247.5z");
        type_svg.setAttribute("stroke", "black");
        type_svg.setAttribute("opacity", "1");
        type_svg.setAttribute("fill", "black");
        type_svg.setAttribute('transform', 'translate(8 3) scale(' + `${scaleString}` + ')');
        return type_svg;
    }

    private getTypeService(): SVGElement {
        let scale: String = this.replaceNumberToString(this._width / 10 / 380);
        let type_svg = this.createSvgElement('svg');
        this.AddTypeServiceUndergroundGear(type_svg, scale);
        this.AddTypeServiceOverlapRect(type_svg, scale);
        this.AddTypeServiceFrontGear(type_svg, scale);


        return type_svg;
    }

    private AddTypeServiceUndergroundGear(type_svg: SVGElement, scale: String): void {
        // innen Kreis unteres Rad
        let type_path1 = this.createSvgElement('path');
        type_path1.setAttribute("d", "M285,192.2c-0.9-62.6-56.7-95.8-107.4-94.3c-1.4-0.2-2.8-0.3-4.3-0.1c-3.2,0.3-6.4,0.8-9.3,1.4c-4.5,0.7-8.8,1.7-12.8,2.9" +
            " c-1.1,0.3-2.2,0.8-3.3,1.4c-37.3,12.9-60.8,43.5-64.5,84c-2,21.8,4,42.4,17.3,59.4c17.5,22.4,46.5,37.5,77.7,40.5" +
            " c2.9,0.3,5.7,0.4,8.6,0.4l0,0c27.3,0,54.9-12.1,73.7-32.5C276.8,237.5,285.3,215.7,285,192.2z M249.7,199" +
            " c0.2,10.9-3.5,20.4-10.9,28.4c-12.3,13.3-35,21.8-57.9,21.8c-4.4,0-8.6-0.3-12.5-1c-33.5-5.8-46.6-29.8-47.8-50.4" +
            " c-1.3-22.3,11.1-50.6,41.1-59.9c6.6-1.8,13.5-2.8,20.4-2.8C215.2,135.1,249.1,157.1,249.7,199z");
        type_path1.setAttribute("stroke", "black");
        type_path1.setAttribute("opacity", "1");
        type_path1.setAttribute("fill", "black");
        type_path1.setAttribute('transform', 'translate(8 8) scale(' + scale + ')');
        type_svg.append(type_path1);

        // außen Kreis unteres Rad
        let type_path2 = this.createSvgElement('path');
        type_path2.setAttribute("d", "M347.8,159c-0.1-1.2-0.3-2.4-0.7-3.6c-0.1-5.6-3.2-10.2-8.2-12.2c-0.7-0.5-1.4-0.9-2.2-1.2c-9.3-4-18.2-8.4-27.9-13.3" +
            " c1.7-8.5,3.5-17,5.2-25.5c0.2-0.8,0.2-1.7,0.2-2.5c0.3-3.1-0.8-6.1-3.1-8.4C297.4,78,282.4,66,266.4,56.5c-2.2-1.3-4.6-1.8-7-1.5" +
            " h0c-1.8,0-3.6,0.5-5.3,1.4c-3.2,1.7-6.3,3.5-9.4,5.3c-3.6-7.2-7.2-14.8-10.5-22.3c-0.3-0.8-0.8-1.5-1.2-2.2" +
            " c-2.1-5-6.7-8.1-12.3-8.2c-1.2-0.4-2.4-0.6-3.5-0.7c-9.1-0.6-18.2-1.3-27.3-2.1c-15.2-1.2-30.8-2.5-46.3-3l-0.6,0" +
            " c-5.5,0-10.1,3-12.1,7.9c-0.8,0.9-1.4,1.9-1.9,3.1l-1.7,3.7c-3,6.5-6.1,13.1-8.9,19.9c-10-2.9-20.4-6.2-31.5-10.1" +
            " c-5.3-1.8-10.7,0.6-13,5.6c-0.1,0.1-0.2,0.2-0.3,0.4C62.6,69,50.5,82.8,40.2,94.3c-3.1,3.5-3.8,8.1-1.8,12.2" +
            " c0.2,0.7,0.4,1.3,0.7,1.9c2.9,6.2,5.9,12.9,9,20.2c-7.1,2.9-14.1,6.2-20.9,9.4l-4,1.9c-1.1,0.5-2.1,1.2-3.1,1.9" +
            " c-5.1,2.1-8.1,6.9-7.9,12.7c0.6,15.5,1.8,31.2,3,46.3c0.7,9.1,1.5,18.2,2.1,27.3c0.1,1.2,0.3,2.4,0.7,3.6" +
            " c0.1,5.6,3.2,10.2,8.2,12.3c0.7,0.5,1.4,0.9,2.2,1.2c8.6,3.7,17.1,7.9,25.7,12.1c-0.9,2.7-1.7,5.5-2.6,8.2c-2.2,7-4.4,14.1-6.7,21" +
            " c-1.4,4.2-0.2,8.5,3,11.3l0.6,0.6c13.5,11.9,27.8,22.1,42.5,30.2c0.6,0.4,1.3,0.7,2,0.9c2.3,0.9,4.9,1,7.4,0.1" +
            " c5.8-2,11.5-4.1,17.3-6.2l1.5-0.6c4.1,8.3,8.1,16.5,11.7,24.8c0.3,0.8,0.8,1.5,1.3,2.2c2.1,5,6.7,8.1,12.2,8.2" +
            " c1.2,0.4,2.4,0.6,3.6,0.7c9.1,0.6,18.2,1.3,27.3,2.1c15.2,1.2,30.8,2.5,46.4,3l0.6,0c5.5,0,10.1-3,12.1-7.9c0.8-0.9,1.4-1.9,2-3.1" +
            " l1.8-3.8c2.8-6.1,5.7-12.3,8.4-18.7c9.4,3.4,18.5,5.8,27.7,7.2c0.6,0.1,1.2,0.1,1.8,0.1c1,0,2-0.1,3-0.4c1.5-0.3,3-1,4.3-2" +
            " c13.8-10.3,31.1-24.6,43.2-44c1.4-2.2,1.9-4.6,1.6-7c0-1.9-0.5-3.9-1.5-5.6c-4-7-7.2-13.7-9.6-20.4c7.2-2.9,14.2-6.2,21-9.4l4-1.9" +
            " c1.1-0.5,2.1-1.2,3.1-1.9c5.1-2.1,8.1-6.9,7.9-12.7c-0.6-15.5-1.8-31.2-3-46.3C349.1,177.2,348.3,168.1,347.8,159z M213.6,335.6" +
            " c-12.8-0.6-25.7-1.7-38.2-2.7c-7.1-0.6-14.3-1.1-21.4-1.6c-4.1-9.2-8.6-18.2-13.1-27.4c-0.7-1.4-1.6-2.6-2.7-3.7" +
            " c-2.7-3.6-7.3-5.1-11.8-3.5c-5.4,1.9-10.9,3.9-16.3,5.9c-4.1,1.5-8.2,3-12.3,4.4C87.4,301,77.5,294,68.1,286.1" +
            " c1.4-4.5,2.9-9.1,4.3-13.6c2.2-6.9,4.3-13.8,6.6-20.7c0.6-1.8,0.7-3.6,0.4-5.3c0-4.8-2.7-9-7.3-11.3c-9.2-4.6-18.2-9.1-27.4-13.1" +
            " c-0.5-7.2-1.1-14.4-1.6-21.5c-1-12.5-2-25.4-2.6-38.1l0.9-0.4c7.2-3.4,14.7-6.9,22.3-9.7c4-1.5,6.9-4.1,8.5-7.7" +
            " c2.3-5.1,1.8-11.7-1.5-20.2c-0.5-1.2-1.5-3-3.4-6.5c-1.7-3.2-5.5-9.9-6.8-13.3c11-12.3,19.8-23.2,27.5-33.7" +
            " c4.4,1.3,13.1,4.3,17.3,5.8c3,1.1,5.3,1.9,6.1,2.1c1.2,0.4,2.6,0.9,4.1,1.5c4,1.6,8.6,3.4,13.2,3.4c6,0,10.4-3.2,12.6-9" +
            " c2.8-7.5,6.3-15,9.6-22.2l0.5-1c12.7,0.6,25.6,1.7,38.1,2.7c7.2,0.6,14.4,1.1,21.6,1.6c4.1,9.2,8.6,18.2,13.1,27.4" +
            " c2.3,4.6,6.5,7.3,11.4,7.3c2.6,0,5.3-0.8,7.2-2l1-0.5c5.4-3.4,11-6.6,16.1-9.4c11,7,21.6,15.5,31.5,25.2" +
            " c-2.2,10.9-4.4,21.8-6.7,32.7c-0.7,3.4,0.1,6.8,2.2,9.3c1.2,2.6,3.3,4.7,6.1,6.1c9.2,4.6,18.2,9,27.4,13.1" +
            " c0.5,7.2,1.1,14.4,1.6,21.6c1,12.5,2,25.4,2.6,38.1l-0.9,0.4c-7.3,3.4-14.7,6.9-22.3,9.7c-4.4,1.6-7.5,5-8.8,9.4" +
            " c-1.1,2.2-1.3,4.7-0.8,7.1c2.4,11,6.5,22,12.5,33.4c-7.3,10.3-16.9,19.9-30.8,30.4c-8.7-1.7-17.3-4.4-25.9-7.9" +
            " c-2.6-2.6-6.4-4.2-10.4-4.2c-6.2,0-11.3,3.6-13.4,9.3c-2.8,7.6-6.3,15.1-9.7,22.3L213.6,335.6z M222.2,358.7L222.2,358.7" +
            " L222.2,358.7L222.2,358.7z");
        type_path2.setAttribute("stroke", "black");
        type_svg.setAttribute("stroke-width", "3");
        type_path2.setAttribute("opacity", "1");
        type_path2.setAttribute("fill", "black");
        type_path2.setAttribute('transform', 'translate(8 8) scale(' + scale + ')');
        type_svg.append(type_path2);
    }
    private AddTypeServiceOverlapRect(type_svg: SVGElement, scale: String): void {
        // 3x Rechteck zur Verdeckung zwischen den beiden Rädern
        let type_rect = this.createSvgElement('rect');
        type_rect.setAttribute('x', `281.2`);
        type_rect.setAttribute('y', `143.6`);
        type_rect.setAttribute('width', `60.8`);
        type_rect.setAttribute('height', `42.8`);
        type_rect.setAttribute('fill', `white`);
        type_rect.setAttribute('transform', 'translate(8 8) scale(' + scale + ')');
        type_svg.append(type_rect);

        let type_rect1 = this.createSvgElement('rect');
        type_rect1.setAttribute('x', `165.2`);
        type_rect1.setAttribute('y', `187.9`);
        type_rect1.setAttribute('width', `232`);
        type_rect1.setAttribute('height', `207`);
        type_rect1.setAttribute('fill', `white`);
        type_rect1.setAttribute('transform', 'translate(8 8) scale(' + scale + ') matrix(0.7591 -0.6509 0.6509 0.7591 -121.9079 253.2275)');
        type_svg.append(type_rect1);

        let type_rect2 = this.createSvgElement('rect');
        type_rect2.setAttribute('x', `291`);
        type_rect2.setAttribute('y', `186.5`);
        type_rect2.setAttribute('width', `122.4`);
        type_rect2.setAttribute('height', `241.8`);
        type_rect2.setAttribute('fill', `white`);
        type_rect2.setAttribute('transform', 'translate(8 8) scale(' + scale + ')');
        type_svg.append(type_rect2);

        this.addSVGtoColorChange(type_rect);
        this.addSVGtoColorChange(type_rect1);
        this.addSVGtoColorChange(type_rect2);

    }

    private AddTypeServiceFrontGear(type_svg: SVGElement, scale: String): void {
        // innen Kreis Oberes Rad
        var type_path3 = this.createSvgElement('path');
        type_path3.setAttribute("d", "M403,301.2c-0.9-62.6-56.7-95.8-107.4-94.3c-1.4-0.2-2.8-0.3-4.3-0.1c-3.2,0.3-6.4,0.8-9.3,1.4c-4.5,0.7-8.8,1.7-12.8,2.9" +
            " c-1.1,0.3-2.2,0.8-3.3,1.4c-37.3,12.9-60.8,43.5-64.5,84c-2,21.8,4,42.4,17.3,59.4c17.5,22.4,46.5,37.5,77.7,40.5" +
            " c2.9,0.3,5.7,0.4,8.6,0.4l0,0c27.3,0,54.9-12.1,73.7-32.5C394.8,346.5,403.3,324.7,403,301.2z M367.7,308" +
            " c0.2,10.9-3.5,20.4-10.9,28.4c-12.3,13.3-35,21.8-57.9,21.8c-4.4,0-8.6-0.3-12.5-1c-33.5-5.8-46.6-29.8-47.8-50.4" +
            " c-1.3-22.3,11.1-50.6,41.1-59.9c6.6-1.8,13.5-2.8,20.4-2.8C333.2,244.1,367.1,266.1,367.7,308z");
        type_path3.setAttribute("stroke", "black");
        type_path3.setAttribute("opacity", "1");
        type_path3.setAttribute("fill", "black");
        type_path3.setAttribute('transform', 'translate(8 8) scale(' + scale + ')');
        type_svg.append(type_path3);



        // außen Kreis Oberes Rad
        var type_path4 = this.createSvgElement('path');
        type_path4.setAttribute("d", "M465.8,268c-0.1-1.2-0.3-2.4-0.7-3.6c-0.1-5.6-3.2-10.2-8.2-12.2c-0.7-0.5-1.4-0.9-2.2-1.2c-9.3-4-18.2-8.4-27.9-13.3 " +
            "c1.7-8.5,3.5-17,5.2-25.5c0.2-0.8,0.2-1.7,0.2-2.5c0.3-3.1-0.8-6.1-3.1-8.4c-13.7-14.2-28.7-26.2-44.7-35.7c-2.2-1.3-4.6-1.8-7-1.5 " +
            "h0c-1.8,0-3.6,0.5-5.3,1.4c-3.2,1.7-6.3,3.5-9.4,5.3c-3.6-7.2-7.2-14.8-10.5-22.3c-0.3-0.8-0.8-1.5-1.2-2.2c-2.1-5-6.7-8.1-12.3-8.2 " +
            "c-1.2-0.4-2.4-0.6-3.5-0.7c-9.1-0.6-18.2-1.3-27.3-2.1c-15.2-1.2-30.8-2.5-46.3-3l-0.6,0c-5.5,0-10.1,3-12.1,7.9 " +
            "c-0.8,0.9-1.4,1.9-1.9,3.1l-1.7,3.7c-3,6.5-6.1,13.1-8.9,19.9c-10-2.9-20.4-6.2-31.5-10.1c-5.3-1.8-10.7,0.6-13,5.6 " +
            "c-0.1,0.1-0.2,0.2-0.3,0.4c-10.9,15.4-22.9,29.2-33.3,40.7c-3.1,3.5-3.8,8.1-1.8,12.2c0.2,0.7,0.4,1.3,0.7,1.9 " +
            "c2.9,6.2,5.9,12.9,9,20.2c-7.1,2.9-14.1,6.2-20.9,9.4l-4,1.9c-1.1,0.5-2.1,1.2-3.1,1.9c-5.1,2.1-8.1,6.9-7.9,12.7 " +
            "c0.6,15.5,1.8,31.2,3,46.3c0.7,9.1,1.5,18.2,2.1,27.3c0.1,1.2,0.3,2.4,0.7,3.6c0.1,5.6,3.2,10.2,8.2,12.3c0.7,0.5,1.4,0.9,2.2,1.2 " +
            "c8.6,3.7,17.1,7.9,25.7,12.1c-0.9,2.7-1.7,5.5-2.6,8.2c-2.2,7-4.4,14.1-6.7,21c-1.4,4.2-0.2,8.5,3,11.3l0.6,0.6 " +
            "c13.5,11.9,27.8,22.1,42.5,30.2c0.6,0.4,1.3,0.7,2,0.9c2.3,0.9,4.9,1,7.4,0.1c5.8-2,11.5-4.1,17.3-6.2l1.5-0.6 " +
            "c4.1,8.3,8.1,16.5,11.7,24.8c0.3,0.8,0.8,1.5,1.3,2.2c2.1,5,6.7,8.1,12.2,8.2c1.2,0.4,2.4,0.6,3.6,0.7c9.1,0.6,18.2,1.3,27.3,2.1 " +
            "c15.2,1.2,30.8,2.5,46.4,3l0.6,0c5.5,0,10.1-3,12.1-7.9c0.8-0.9,1.4-1.9,2-3.1l1.8-3.8c2.8-6.1,5.7-12.3,8.4-18.7 " +
            "c9.4,3.4,18.5,5.8,27.7,7.2c0.6,0.1,1.2,0.1,1.8,0.1c1,0,2-0.1,3-0.4c1.5-0.3,3-1,4.3-2c13.8-10.3,31.1-24.6,43.2-44 " +
            "c1.4-2.2,1.9-4.6,1.6-7c0-1.9-0.5-3.9-1.5-5.6c-4-7-7.2-13.7-9.6-20.4c7.2-2.9,14.2-6.2,21-9.4l4-1.9c1.1-0.5,2.1-1.2,3.1-1.9 " +
            "c5.1-2.1,8.1-6.9,7.9-12.7c-0.6-15.5-1.8-31.2-3-46.3C467.1,286.2,466.3,277.1,465.8,268z M331.6,444.6c-12.8-0.6-25.7-1.7-38.2-2.7 " +
            "c-7.1-0.6-14.3-1.1-21.4-1.6c-4.1-9.2-8.6-18.2-13.1-27.4c-0.7-1.4-1.6-2.6-2.7-3.7c-2.7-3.6-7.3-5.1-11.8-3.5 " +
            "c-5.4,1.9-10.9,3.9-16.3,5.9c-4.1,1.5-8.2,3-12.3,4.4c-10.4-6.1-20.4-13.1-29.7-20.9c1.4-4.5,2.9-9.1,4.3-13.6 " +
            "c2.2-6.9,4.3-13.8,6.6-20.7c0.6-1.8,0.7-3.6,0.4-5.3c0-4.8-2.7-9-7.3-11.3c-9.2-4.6-18.2-9.1-27.4-13.1c-0.5-7.2-1.1-14.4-1.6-21.5 " +
            "c-1-12.5-2-25.4-2.6-38.1l0.9-0.4c7.2-3.4,14.7-6.9,22.3-9.7c4-1.5,6.9-4.1,8.5-7.7c2.3-5.1,1.8-11.7-1.5-20.2 " +
            "c-0.5-1.2-1.5-3-3.4-6.5c-1.7-3.2-5.5-9.9-6.8-13.3c11-12.3,19.8-23.2,27.5-33.7c4.4,1.3,13.1,4.3,17.3,5.8c3,1.1,5.3,1.9,6.1,2.1 " +
            "c1.2,0.4,2.6,0.9,4.1,1.5c4,1.6,8.6,3.4,13.2,3.4c6,0,10.4-3.2,12.6-9c2.8-7.5,6.3-15,9.6-22.2l0.5-1c12.7,0.6,25.6,1.7,38.1,2.7 " +
            "c7.2,0.6,14.4,1.1,21.6,1.6c4.1,9.2,8.6,18.2,13.1,27.4c2.3,4.6,6.5,7.3,11.4,7.3c2.6,0,5.3-0.8,7.2-2l1-0.5 " +
            "c5.4-3.4,11-6.6,16.1-9.4c11,7,21.6,15.5,31.5,25.2c-2.2,10.9-4.4,21.8-6.7,32.7c-0.7,3.4,0.1,6.8,2.2,9.3c1.2,2.6,3.3,4.7,6.1,6.1 " +
            "c9.2,4.6,18.2,9,27.4,13.1c0.5,7.2,1.1,14.4,1.6,21.6c1,12.5,2,25.4,2.6,38.1l-0.9,0.4c-7.3,3.4-14.7,6.9-22.3,9.7 " +
            "c-4.4,1.6-7.5,5-8.8,9.4c-1.1,2.2-1.3,4.7-0.8,7.1c2.4,11,6.5,22,12.5,33.4c-7.3,10.3-16.9,19.9-30.8,30.4 " +
            "c-8.7-1.7-17.3-4.4-25.9-7.9c-2.6-2.6-6.4-4.2-10.4-4.2c-6.2,0-11.3,3.6-13.4,9.3c-2.8,7.6-6.3,15.1-9.7,22.3L331.6,444.6z " +
            "M340.2,467.7L340.2,467.7L340.2,467.7L340.2,467.7z");
        type_path4.setAttribute("stroke", "black");
        type_path4.setAttribute("opacity", "1");
        type_path4.setAttribute("fill", "black");
        type_path4.setAttribute('transform', 'translate(8 8) scale(' + scale + ')');
        type_svg.append(type_path4);
    }



    private getTypeBusinessRule(): SVGElement {
        let type_svg = this.createSvgElement('svg');
        let scaleString: String = this.replaceNumberToString(0.0175 * this._myScale);
        let transformString = "translate(8 8) scale(" + scaleString + ")";
        this.addRectForBusinessRule(type_svg, transformString);
        this.addLineForBusinessRule(type_svg, transformString);
        return type_svg;
    }

    private addRectForBusinessRule(type_svg: SVGElement, transformString: string): void {
        let type_rect = this.createSvgElement('rect');
        type_rect.setAttribute('x', `60`);
        type_rect.setAttribute('y', `60`);
        type_rect.setAttribute('width', `1840`);
        type_rect.setAttribute('height', `1000`);
        type_rect.setAttribute('fill', `white`);
        type_rect.setAttribute('stroke-width', `20`);
        type_rect.setAttribute('stroke', `black`);
        type_rect.setAttribute('stroke-miterlimit', `10`);
        type_rect.setAttribute('transform', transformString);
        type_svg.append(type_rect);
        this.addSVGtoColorChange(type_rect);

        let type_rect1 = this.createSvgElement('rect');
        type_rect1.setAttribute('x', `60`);
        type_rect1.setAttribute('y', `60`);
        type_rect1.setAttribute('width', `1840`);
        type_rect1.setAttribute('height', `300`);
        type_rect1.setAttribute('fill', `black`);
        type_rect1.setAttribute('opacity', `0.35`);
        type_rect1.setAttribute('stroke-width', `20`);
        type_rect1.setAttribute('stroke', `black`);
        type_rect1.setAttribute('stroke-miterlimit', `10`);
        type_rect1.setAttribute('transform', transformString);
        type_svg.append(type_rect1);
    }

    private addLineForBusinessRule(type_svg: SVGElement, transformString: string): void {
        let type_line = this.createSvgElement('line');
        type_line.setAttribute("x1", "444");
        type_line.setAttribute("x2", "444");
        type_line.setAttribute("y1", "360");
        type_line.setAttribute("y2", "1060");
        type_line.setAttribute("stroke", "black");
        type_line.setAttribute("stroke-width", "20");
        type_line.setAttribute('transform', transformString);
        type_svg.append(type_line);

        let type_line1 = this.createSvgElement('line');
        type_line1.setAttribute("x1", "60");
        type_line1.setAttribute("x2", "1900");
        type_line1.setAttribute("y1", "710");
        type_line1.setAttribute("y2", "710");
        type_line1.setAttribute("stroke", "black");
        type_line1.setAttribute("stroke-width", "20");
        type_line1.setAttribute('transform', transformString);
        type_svg.append(type_line1);

        let type_line2 = this.createSvgElement('line');
        type_line2.setAttribute("x1", "60");
        type_line2.setAttribute("x2", "1900");
        type_line2.setAttribute("y1", "360");
        type_line2.setAttribute("y2", "360");
        type_line2.setAttribute("stroke", "black");
        type_line2.setAttribute("stroke-width", "20");
        type_line2.setAttribute('transform', transformString);
        type_svg.append(type_line2);
    }


    private getTypeReceiving(): SVGElement {
        let scaleString: String = this.replaceNumberToString(0.05 * this._myScale);
        let type_svg = this.createSvgElement('path');
        type_svg.setAttribute("id", "pathIdD");
        type_svg.setAttribute("d", "M437.5,59.3h-401C16.4,59.3,0,75.7,0,95.8v282.4c0,20.1,16.4,36.5,36.5,36.5h401c20.1,0,36.5-16.4,36.5-36.5V95.8 C474,75.7,457.6,59.3,437.5,59.3z M432.2,86.3L239.5,205.1L46.8,86.3H432.2z M447,378.2c0,5.2-4.3,9.5-9.5,9.5h-401 c-5.2,0-9.5-4.3-9.5-9.5V104.9l203.7,128.2c0.1,0.1,0.3,0.2,0.4,0.3c0.1,0.1,0.3,0.2,0.4,0.3c0.3,0.2,0.5,0.4,0.8,0.5 c0.1,0.1,0.2,0.1,0.3,0.2c0.4,0.2,0.8,0.4,1.2,0.6c0.1,0,0.2,0.1,0.3,0.1c0.3,0.1,0.6,0.3,1,0.4c0.1,0,0.3,0.1,0.4,0.1 c0.3,0.1,0.6,0.2,0.9,0.2c0.1,0,0.3,0.1,0.4,0.1c0.3,0.1,0.7,0.1,1,0.2c0.1,0,0.2,0,0.3,0c0.4,0,0.9,0.1,1.3,0.1l0,0l0,0 c0.4,0,0.9,0,1.3-0.1c0.1,0,0.2,0,0.3,0c0.3,0,0.7-0.1,1-0.2c0.1,0,0.3-0.1,0.4-0.1c0.3-0.1,0.6-0.2,0.9-0.2c0.1,0,0.3-0.1,0.4-0.1 c0.3-0.1,0.6-0.2,1-0.4c0.1,0,0.2-0.1,0.3-0.1c0.4-0.2,0.8-0.4,1.2-0.6c0.1-0.1,0.2-0.1,0.3-0.2c0.3-0.2,0.5-0.3,0.8-0.5 c0.1-0.1,0.3-0.2,0.4-0.3c0.1-0.1,0.3-0.2,0.4-0.3L447,109.2V378.2z");
        type_svg.setAttribute("stroke", "black");
        type_svg.setAttribute("opacity", "1");
        type_svg.setAttribute("fill", "black");
        type_svg.setAttribute('transform', 'translate(8 3) scale(' + `${scaleString}` + ')');
        return type_svg;
    }

    private getTypeUserTask(): SVGElement {
        let scaleString: String = this.replaceNumberToString(0.2 * this._myScale);
        let type_svg = this.createSvgElement('svg');
        let type_path1 = this.createSvgElement('path');
        type_path1.setAttribute("d", "M47.893,47.221c11.768,0,21.341-10.592,21.341-23.611S59.66,0,47.893,0C36.125,0,26.55,10.592,26.55,23.61 C26.55,36.63,36.125,47.221,47.893,47.221z");
        type_path1.setAttribute("stroke", "black");
        type_path1.setAttribute("fill", "black");
        type_path1.setAttribute('transform', 'translate(8 8) scale(' + `${scaleString}` + ')');
        type_svg.append(type_path1);

        let type_path2 = this.createSvgElement('path');
        type_path2.setAttribute("d", "M72.477,44.123c-1.244-0.269-2.524,0.272-3.192,1.355C61.65,57.847,49.34,58.204,47.962,58.204 s-13.687-0.357-21.32-12.722c-0.67-1.085-1.953-1.628-3.198-1.354C6.868,47.777,2.497,72.798,3.789,93.115 c0.101,1.58,1.411,2.811,2.994,2.811h82.36c1.583,0,2.894-1.23,2.993-2.811C93.429,72.775,89.057,47.74,72.477,44.123z");
        type_path2.setAttribute("stroke", "black");
        type_path2.setAttribute("fill", "black");
        type_path2.setAttribute('transform', 'translate(8 8) scale(' + `${scaleString}` + ')');
        type_svg.append(type_path2);

        return type_svg;
    }




    private getText(): SVGElement {
        let text = this.createSvgElement('text');
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('font-size', '12px');
        text.setAttribute('text-align', 'justified');
        text.setAttribute('line-height', '110%');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('text-anchor', 'middle');

        let textLabel = this._label + "this._label";
        let A = this.splitString(this._label);
        if (A.length > 4) {
            A = A.slice(0, 3);
            A.push("...");
        }
        let y: number = (this._height / 2) - (6 * (A.length - 1));
        A.forEach(s => {
            let textNode = this.newTSpan(`${s}`, y);
            y = y + 15;
            text.appendChild(textNode);
        });
        return text;
    }

    private newTSpan(text: string, y: number): SVGElement {
        let tspan = this.createSvgElement('tspan');
        tspan.setAttribute("x", '50%');
        tspan.setAttribute("y", `${y}`);
        tspan.textContent = text;
        return tspan;
    }

    private splitString(text: String): Array<string> {
        let A: Array<string> = text.split(" ");
        let B: Array<string> = [""];
        let i: number = 0;
        let j: number = 0;
        let splitAfter: number = 15;
        let index: number = 0;

        A.forEach(Atte => {
            if ((B[j].length + Atte.length) > splitAfter) {
                j++;
                if (Atte.length > splitAfter) {
                    for (index = 0; (Atte.length - index) > splitAfter; index = index + splitAfter) {
                        B.push(Atte.substring(index, index + splitAfter) + "-");
                        j++;
                    }
                    B.push(Atte.substring(index, index + splitAfter));
                } else {
                    B.push(Atte);
                }
            } else {
                B[j] = B[j] + " " + Atte;
            }
        });
        return B;
    }








}
