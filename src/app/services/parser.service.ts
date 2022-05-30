import { Injectable } from '@angular/core';
import { Diagram } from '../classes/diagram/diagram';
import { Element } from '../classes/diagram/element';
import { Gateway } from '../classes/diagram/elements/gateway';
import { Event } from '../classes/diagram/elements/event';

import { EventType } from '../classes/diagram/elements/eventtype';
import { GatewayType } from '../classes/diagram/elements/gatewaytype';
import { Task } from '../classes/diagram/elements/task';
import { TaskType } from '../classes/diagram/elements/tasktype';
import { Connector } from '../classes/diagram/elements/connector';
import { Connectortype } from '../classes/diagram/elements/connectortype';
import { EinPfeil } from '../classes/diagram/elements/EinPfeil';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }

    parse(text: string): Diagram | undefined {
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



    private parseElement(line: string): Element {
        //return new Task("t1","Hotel buchen", TaskType.Service);
        // return new Gateway("G1",GatewayType.AND_JOIN); // XOR_JOIN OR_JOIN AND_JOIN
        return new Event("E1", "Test", EventType.Intermediate);  // Start, End, Intermediate
        // return new Task("t1","Hotel buchen", TaskType.UserTask);  //Sending, Manual, Service, BusinessRule, Receiving, UserTask};
    }


    private testDiagramm(): Diagram {
        const result = new Diagram();
        let elementE1 = new Event("E1", "Start", EventType.Start);
        elementE1.x = 60;
        elementE1.y = 190;
        result.addElement(elementE1);

        let elementE2 = new Event("E2", "", EventType.Intermediate);
        elementE2.x = 850;
        elementE2.y = 190;
        result.addElement(elementE2);



        let elementE3 = new Event("E3", "Ende", EventType.End);
        elementE3.x = 1600;
        elementE3.y = 190;
        result.addElement(elementE3);

        let elementT1 = new Task("t1", "Hotel buchen", TaskType.Service);
        elementT1.x = 442;
        elementT1.y = 60;
        result.addElement(elementT1);

        let elementT2 = new Task("t2", "Flug buchen", TaskType.Manual);
        elementT2.x = 442;
        elementT2.y = 320;
        result.addElement(elementT2);

        let elLamborgini = new Task("tLambo", "Lamborghini buchen", TaskType.Manual);
        elLamborgini.x = 0;
        elLamborgini.y = 0;
        result.addElement(elLamborgini);

     

        let elementT3 = new Task("t3", "Drucken", TaskType.UserTask);
        elementT3.x = 1225;
        elementT3.y = 190;
        result.addElement(elementT3);

        let elementG1 = new Gateway("G1", GatewayType.AND_SPLIT);
        elementG1.x = 210;
        elementG1.y = 190; 
        result.addElement(elementG1);

        let elementG2 = new Gateway("G2", GatewayType.AND_SPLIT);
        elementG2.x = 675;
        elementG2.y = 190; 
        result.addElement(elementG2);

        let connector = new EinPfeil("p1", "", elementE1, elementG1);
        result.addEdge(elementE1, elementG1);
        result.addElement(connector);

        let pfeil = new EinPfeil("p2","label", elementG1, elementT1);
        result.addEdge(elementG1, elementT1);
        result.addElement(pfeil);

        let connector2: EinPfeil = new EinPfeil("p3", "", elementG1, elementT2);
        connector2.addPfeilEcke(210, 320);

        result.addEdge(elementG1, elementT2);
        result.addElement(connector2);

        let connector3: EinPfeil = new EinPfeil("A4", "",  elementT1, elementG2);
        connector3.addPfeilEcke(675, 60);
        result.addEdge(elementT1, elementG2);
        result.addElement(connector3);

        let connector4 = new EinPfeil("A5", "", elementT2, elementG2);
        connector4.addPfeilEcke(675, 320);
        result.addEdge(elementT2, elementG2);
        result.addElement(connector4);

        let connector5 = new EinPfeil("A6", "", elementG2, elementE2);
        result.addEdge(elementG2, elementE2);
        result.addElement(connector5)

        let connector6 = new EinPfeil("A7", "", elementE2, elementT3);
        result.addEdge(elementE2, elementT3);
        result.addElement(connector6)

        let connector7 = new EinPfeil("A8", "", elementT3, elementE3);
        result.addEdge(elementT3, elementE3);
        result.addElement(connector7)

        let connector8 = new EinPfeil("A9", "", elementE3, elementE2);
        connector8.addPfeilEcke(1600, 60);
        connector8.addPfeilEcke(850, 60);
        result.addEdge(elementE3, elementE2);
        result.addElement(connector8);


        let pp = new EinPfeil("pLamboEin", "", elementG1, elLamborgini);
        result.addEdge(elementG1, elLamborgini);
        result.addElement(pp);

        let ppp = new EinPfeil("pLamboAus", "", elLamborgini, elementG2);
        result.addEdge(elLamborgini, elementG2);
        result.addElement(ppp);

        return result;
    }
}
