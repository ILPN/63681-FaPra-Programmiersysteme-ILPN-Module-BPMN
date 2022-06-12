import { Injectable } from '@angular/core';
import { Diagram } from '../classes/diagram/diagram';
import { Element } from '../classes/diagram/element';
import { Gateway } from '../classes/diagram/elements/gateway';
import { Event } from '../classes/diagram/elements/event';

import { EventType } from '../classes/diagram/elements/eventtype';
import { GatewayType } from '../classes/diagram/elements/gatewaytype';
import { Task } from '../classes/diagram/elements/task';
import { TaskType } from '../classes/diagram/elements/tasktype';
import { Arrow } from '../classes/diagram/elements/arrow/Arrow';
import { MyDiagram } from '../classes/diagram/MyDiagram';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }

    parse(text: string): MyDiagram | undefined {
        const lines = text.split('\n');

        // const result = new Diagram();
        //
        // lines.forEach(line => {
        //     if (line.trimEnd().length > 0) {
        //         result.addElement(this.parseElement(line));
        //     }
        // });
        const result = this.testDiagramm();

        return result;
    }


/*
    private parseElement(line: string): Element {
        //return new Task("t1","Hotel buchen", TaskType.Service);
        // return new Gateway("G1",GatewayType.AND_JOIN); // XOR_JOIN OR_JOIN AND_JOIN
        return new Event("E1", "Test", EventType.Intermediate, result);  // Start, End, Intermediate
        // return new Task("t1","Hotel buchen", TaskType.UserTask);  //Sending, Manual, Service, BusinessRule, Receiving, UserTask};
    }
*/

    private testDiagramm(): MyDiagram {
        const result = new MyDiagram();
        let elementE1 = new Event("E1", "Start", EventType.Start,result);
        elementE1.x = 60;
        elementE1.y = 190;
        result.addElement(elementE1);

        let elementE2 = new Event("E2", "", EventType.Intermediate,result);
        elementE2.x = 850;
        elementE2.y = 190;
        result.addElement(elementE2);



        let elementE3 = new Event("E3", "Ende", EventType.End, result);
        elementE3.x = 1600;
        elementE3.y = 190;
        result.addElement(elementE3);

        let elementT1 = new Task("t1", "Hotel buchen", TaskType.Service, result);
        elementT1.x = 442;
        elementT1.y = 60;
        result.addElement(elementT1);

        let elementT2 = new Task("t2", "Flug buchen", TaskType.Manual, result);
        elementT2.x = 442;
        elementT2.y = 320;
        result.addElement(elementT2);

        let elLamborgini = new Task("tLambo", "Lamborghini buchen", TaskType.Manual, result);
        elLamborgini.x = 0;
        elLamborgini.y = 0;
        result.addElement(elLamborgini);

     

        let elementT3 = new Task("t3", "Drucken", TaskType.UserTask, result);
        elementT3.x = 1225;
        elementT3.y = 190;
        result.addElement(elementT3);

        let elementG1 = new Gateway("G1", GatewayType.AND_SPLIT, result);
        elementG1.x = 210;
        elementG1.y = 190; 
        result.addElement(elementG1);

        let elementG2 = new Gateway("G2", GatewayType.AND_SPLIT,result);
        elementG2.x = 675;
        elementG2.y = 190; 
        result.addElement(elementG2);

        let connector = new Arrow("p1", "", elementE1, elementG1,result);
        result.addElement(connector);

        let pfeil = new Arrow("p2","label", elementG1, elementT1, result);
        result.addElement(pfeil);

        let connector2: Arrow = new Arrow("p3", "", elementG1, elementT2, result);
        connector2.addArrowCorner(210, 320);

        result.addElement(connector2);

        let connector3: Arrow = new Arrow("A4", "",  elementT1, elementG2, result);
        connector3.addArrowCorner(675, 60);
        result.addElement(connector3);

        let connector4 = new Arrow("A5", "", elementT2, elementG2, result);
        connector4.addArrowCorner(675, 320);
        result.addElement(connector4);

        let connector5 = new Arrow("A6", "", elementG2, elementE2, result);
        result.addElement(connector5)

        let connector6 = new Arrow("A7", "", elementE2, elementT3, result);
        result.addElement(connector6)

        let connector7 = new Arrow("A8", "", elementT3, elementE3, result);
        result.addElement(connector7)

        let connector8 = new Arrow("A9", "", elementE3, elementE2, result);
        connector8.addArrowCorner(1600, 60);
        connector8.addArrowCorner(850, 60);
        result.addElement(connector8);


        let pp = new Arrow("pLamboEin", "", elementG1, elLamborgini, result);
        result.addElement(pp);

        let ppp = new Arrow("pLamboAus", "", elLamborgini, elementG2, result);
        result.addElement(ppp);

        return result;
    }
}
