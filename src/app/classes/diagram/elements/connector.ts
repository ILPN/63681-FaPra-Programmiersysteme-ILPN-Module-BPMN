import { tSCallSignatureDeclaration } from "@babel/types";
import { Element } from "../element";
import { ConnectorElement } from "./connector-element";
import { Connectortype } from "./connectortype";

export class Connector extends Element {
    private _label: String;
    private _type: Connectortype;
    private _pathConnectorElements: ConnectorElement[];
    public get pathConnectorElements(): ConnectorElement[] {
        return this._pathConnectorElements;
    }
    private _start: Element;
    private _end: Element;


    constructor(id: string, label: string, type: Connectortype, start: Element, end: Element) {
        super(id);
        this._label = label;
        this._type = type;
        this._start = start;
        this._end = end;
        this._pathConnectorElements = [];
    }


    get start(): Element {
        return this._start;
    }

    set start(value: Element) {
        this._start = value;
    }


    get end(): Element {
        return this._end;
    }

    set end(value: Element) {
        this._end = value;
    }

    public get type(): Connectortype {
        return this._type;
    }
    public set type(value: Connectortype) {
        this._type = value;
    }

    /**
        * adds edge from this element to target
        * @param target target of new edge
        */
    public addPathConnectorElement(x_Point: number, y_Point: number): void {
        let element: ConnectorElement = new ConnectorElement(this.id + "_pathID" + this._pathConnectorElements.length);
        element.x = x_Point;
        element.y = y_Point;
        this._pathConnectorElements.push(element);
    }
    public deleteAllPathConnectorElements(){
        this._pathConnectorElements = []
    }

    private findPositionOfPathConnectorElement(x_Point: number, y_Point: number): number {
        let pos: number = -1;
        let i: number = 0;
        this._pathConnectorElements.forEach(element => {
        });

        while (i < this._pathConnectorElements.length && pos === -1) {
            if (this._pathConnectorElements[i].x === x_Point && this._pathConnectorElements[i].y === y_Point) {
                pos = i;
            }
            i++;
        }
        return pos;
    }

    public changePathConnectorElement(x_Point_old: number, y_Point_old: number, x_Point_new: number, y_Point_new: number): void {
        let pos: number = this.findPositionOfPathConnectorElement(x_Point_old, y_Point_old);
        this._pathConnectorElements[pos].x = x_Point_new;
        this._pathConnectorElements[pos].y = y_Point_new;
    }

    public removePathConnectorElement(x_Point: number, y_Point: number): void {
        let pos: number = this.findPositionOfPathConnectorElement(x_Point, y_Point);
        this._pathConnectorElements.splice(pos, 1)
        this._pathConnectorElements.splice(pos, 1)
    }



    public createSvg(): SVGElement {
        const svg = this.createUndergroundSVG();
        let firstLine: boolean = true;
        var fromElement: Element = this._start;
        var toElement: Element = this._start;
        for (let i = 0; i < this._pathConnectorElements.length; i++) {
            toElement = this._pathConnectorElements[i];
            svg.append(toElement.createSvg());
            this.kawieichdasdingnennensoll(svg, fromElement, toElement);
            if (firstLine && this._type === Connectortype.InformationFlow) {
                svg.append(this.getCircleIfIsInformationFlow(fromElement.x, fromElement.y, toElement.x, toElement.y, fromElement.distanceX, fromElement.distanceY));
                firstLine = false;
            }
            fromElement = toElement;
        }

        toElement = this._end;
        this.kawieichdasdingnennensoll(svg, fromElement, toElement);

        if (firstLine && this._type === Connectortype.InformationFlow) {
            svg.append(this.getCircleIfIsInformationFlow(fromElement.x, fromElement.y, toElement.x, toElement.y, fromElement.distanceX, fromElement.distanceY));
            firstLine = false;
        }

        if (this._type === Connectortype.InformationFlow || this._type === Connectortype.SequenceFlow) svg.append(this.getArrowIfIsInformationFlow(fromElement.x, fromElement.y, toElement.x, toElement.y, toElement.distanceX, toElement.distanceY));
        this.registerSvg(svg);
        return svg;
    }

    private kawieichdasdingnennensoll(svg: SVGElement, fromElement: Element, toElement: Element): void {
        if (fromElement.x < toElement.x) svg.append(this.getLinie((fromElement.x + fromElement.distanceX), fromElement.y, toElement.x - toElement.distanceX, toElement.y));
        if (fromElement.x > toElement.x) svg.append(this.getLinie((fromElement.x - fromElement.distanceX), fromElement.y, toElement.x + toElement.distanceX, toElement.y));
        if (fromElement.y < toElement.y) svg.append(this.getLinie(fromElement.x, fromElement.y + fromElement.distanceY, toElement.x, toElement.y - toElement.distanceY));
        if (fromElement.y > toElement.y) svg.append(this.getLinie(fromElement.x, fromElement.y - fromElement.distanceY, toElement.x, toElement.y + toElement.distanceY));
    }




    private createUndergroundSVG(): SVGElement {
        const svg = this.createSvgElement('svg');
        svg.setAttribute('id', `${this.id}`);
        svg.setAttribute('x', '0');
        svg.setAttribute('y', '0');
        svg.setAttribute('style', 'overflow: visible;');
        return svg;
    }

    private getLinie(x_Point_from: number, y_Point_From: number, x_Point_To: number, y_Point_To: number): SVGElement {
        let type_line = this.createSvgElement('line');
        type_line.setAttribute("x1", x_Point_from.toString());
        type_line.setAttribute("x2", x_Point_To.toString());
        type_line.setAttribute("y1", y_Point_From.toString());
        type_line.setAttribute("y2", y_Point_To.toString());
        type_line.setAttribute("stroke", "black");
        type_line.setAttribute("stroke-width", "1");
        return type_line;
    }

    private getCircleIfIsInformationFlow(x1: number, y1: number, x2: number, y2: number, xdistance: number, ydistance: number): SVGElement {
        const circle = this.createSvgElement('circle');
        circle.setAttribute('r', "4");
        if (x1 < x2) {
            circle.setAttribute('cx', `${this._start.x + xdistance + 4}`);
            circle.setAttribute('cy', `${this._start.y}`);
        }
        if (x1 > x2) {
            circle.setAttribute('cx', `${this._start.x - xdistance - 4}`);
            circle.setAttribute('cy', `${this._start.y}`);
        }
        if (y1 < y2) {
            circle.setAttribute('cx', `${this._start.x}`);
            circle.setAttribute('cy', `${this._start.y + ydistance + 4}`);
        }
        if (y1 > y2) {
            circle.setAttribute('cx', `${this._start.x}`);
            circle.setAttribute('cy', `${this._start.y - ydistance - 4}`);
        }
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '2');
        return circle;
    }

    private getArrowIfIsInformationFlow(x1: number, y1: number, x2: number, y2: number, xdistance: number, ydistance: number): SVGElement {
        const polygon = this.createSvgElement('polygon');
        let end_point_x: number = x2;
        let end_point_y: number = y2;
        if (x1 < x2) {
            end_point_x = (x2 - xdistance)
            polygon.setAttribute('points', `${end_point_x}` + "," + `${end_point_y}` + ' ' + `${end_point_x - 8}` + "," + `${end_point_y + 5}` + ' ' + +   `${end_point_x - 8}` + "," + `${end_point_y - 5}`);
        } else {
            if (x1 > x2) {
                end_point_x = (x2 + xdistance)
                polygon.setAttribute('points', `${end_point_x}` + "," + `${end_point_y}` + ' ' + `${end_point_x + 8}` + "," + `${end_point_y + 5}` + ' ' + +   `${end_point_x + 8}` + "," + `${end_point_y - 5}`);
            } else {
                if (y1 < y2) {
                    end_point_y = y2 - ydistance;
                    polygon.setAttribute('points', `${end_point_x}` + "," + `${end_point_y}` + ' ' + `${end_point_x + 5}` + "," + `${end_point_y - 8}` + ' ' + +   `${end_point_x - 5}` + "," + `${end_point_y - 8}`);

                } else {
                    if (y1 > y2) {
                        end_point_y = y2 + ydistance;
                        polygon.setAttribute('points', `${end_point_x}` + "," + `${end_point_y}` + ' ' + `${end_point_x + 5}` + "," + `${end_point_y + 8}` + ' ' + +   `${end_point_x - 5}` + "," + `${end_point_y + 8}`);
                    }
                }
            }
        }
        if (this._type === Connectortype.InformationFlow) {
            polygon.setAttribute('fill', 'white');
        } else {
            polygon.setAttribute('fill', 'black');
        }
        polygon.setAttribute('stroke', 'black');
        polygon.setAttribute('stroke-width', '2');
        return polygon;
    }
}
