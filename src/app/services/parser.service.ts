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
import { SwitchController } from '../classes/diagram/elements/switch-controller';
import { Arrow } from '../classes/diagram/elements/arrow/Arrow';


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
      //  const result = this.testDiagrammSchaltung();
        const result = this.testDiagramm();
        const controller = new SwitchController(result);

        return result;
    }



    private parseElement(line: string): Element {
        //return new Task("t1","Hotel buchen", TaskType.Service);
        // return new Gateway("G1",GatewayType.AND_JOIN); // XOR_JOIN OR_JOIN AND_JOIN
        return new Event("E1", "Test", EventType.Intermediate);  // Start, End, Intermediate
        // return new Task("t1","Hotel buchen", TaskType.UserTask);  //Sending, Manual, Service, BusinessRule, Receiving, UserTask};
    }


    private testDiagramm(): Diagram {

        // Probleme bei der Darstellung von Elementen, welche über keine Kanten verfügen

        var result = new Diagram();
        
        
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

        let elementT2 = new Task("t2", "Flug buchen / Auto mieten / Schiff fahren / U-Boot leihen / Fahrrad kaufen", TaskType.Manual);
        elementT2.x = 442;
        elementT2.y = 320;
        result.addElement(elementT2);


        let elementT3 = new Task("t3", "Drucken , Auftragsbestätigungen senden", TaskType.UserTask);

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

        let elementG2 = new Gateway("G2", GatewayType.AND_JOIN);
        elementG2.x = 675;
        elementG2.y = 190; 
        result.addElement(elementG2);



        let connector: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementE1, elementG1);
        result.addEdge(elementE1, elementG1);
        result.addElement(connector);

        let connector = new Arrow("p1", "", elementE1, elementG1);
        result.addEdge(elementE1, elementG1);
        result.addElement(connector);

        let pfeil = new Arrow("p2","label", elementG1, elementT1);

        result.addEdge(elementG1, elementT1);
        result.addElement(connector1);


        

        let connector2: Arrow = new Arrow("p3", "", elementG1, elementT2);
        connector2.addArrowCorner(210, 320);

        result.addEdge(elementG1, elementT2);
        result.addElement(connector2);

        let connector3: Arrow = new Arrow("A4", "",  elementT1, elementG2);
        connector3.addArrowCorner(675, 60);
        result.addEdge(elementT1, elementG2);
        result.addElement(connector3);

        let connector4 = new Arrow("A5", "", elementT2, elementG2);
        connector4.addArrowCorner(675, 320);
        result.addEdge(elementT2, elementG2);
        result.addElement(connector4);

        let connector5 = new Arrow("A6", "", elementG2, elementE2);
        result.addEdge(elementG2, elementE2);
        result.addElement(connector5)

        let connector6 = new Arrow("A7", "", elementE2, elementT3);
        result.addEdge(elementE2, elementT3);
        result.addElement(connector6)

        let connector7 = new Arrow("A8", "", elementT3, elementE3);
        result.addEdge(elementT3, elementE3);
        result.addElement(connector7)

        let connector8 = new Arrow("A9", "", elementE3, elementE2);
        connector8.addArrowCorner(1600, 60);
        connector8.addArrowCorner(850, 60);
        result.addEdge(elementE3, elementE2);
        result.addElement(connector8);


        let pp = new Arrow("pLamboEin", "", elementG1, elLamborgini);
        result.addEdge(elementG1, elLamborgini);
        result.addElement(pp);

        let ppp = new Arrow("pLamboAus", "", elLamborgini, elementG2);
        result.addEdge(elLamborgini, elementG2);
        result.addElement(ppp);

        return result;
    }

    private testDiagramm2(): Diagram {
        var result = new Diagram();
        let elementE1 = new Event("E1", "Start", EventType.Start);
        result.addElement(elementE1);

        let elementE2 = new Event("E2", "", EventType.Intermediate);
        result.addElement(elementE2);

        let elementT1 = new Task("t1", "Hotel buchen", TaskType.Service);
        result.addElement(elementT1);

        let elementT2 = new Task("t2", "Flug buchen", TaskType.Manual);
        result.addElement(elementT2);

        let elementT3 = new Task("t3", "t3", TaskType.Manual);
        result.addElement(elementT3);
        let connector4: Connector = new Connector("A4", "", Connectortype.InformationFlow, elementE2, elementT3);
        result.addEdge(elementE2, elementT3);
        result.addElement(connector4);

        
        let elementT4 = new Task("t4", "t4", TaskType.Manual);
        result.addElement(elementT4);
        let connector5: Connector = new Connector("A4", "", Connectortype.InformationFlow, elementT3, elementT4);
        result.addEdge(elementT3, elementT4);
        result.addElement(connector5);

        
        // let elementT5 = new Task("t5", "t5", TaskType.Manual);
        // result.addElement(elementT5);
        // let connector6: Connector = new Connector("A4", "", Connectortype.InformationFlow, elementT4, elementT5);
        // result.addEdge(elementT4, elementT5);
        // result.addElement(connector6);

        
        // let elementT6 = new Task("t6", "t6", TaskType.Manual);
        // result.addElement(elementT6);
        // let connector7: Connector = new Connector("A4", "", Connectortype.InformationFlow, elementT5, elementT6);
        // result.addEdge(elementT5, elementT6);
        // result.addElement(connector7);

        
        // let elementT7 = new Task("t7", "t7", TaskType.Manual);
        // result.addElement(elementT7);
        // let connector8: Connector = new Connector("A4", "", Connectortype.InformationFlow, elementT6, elementT7);
        // result.addEdge(elementT6, elementT7);
        // result.addElement(connector8);

        let connector: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementE1, elementT1);
        result.addEdge(elementE1, elementT1);
        result.addElement(connector);

        let connector1: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementE1, elementT2);
        result.addEdge(elementE1, elementT2);
        result.addElement(connector1);

        let connector2: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementT1, elementE2);
        result.addEdge(elementT1, elementE2);
        result.addElement(connector2);

        let connector3: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementT2, elementE2);
        result.addEdge(elementT2, elementE2);
        result.addElement(connector3);
        return result;
    }



    private testDiagrammSchaltung(): Diagram {
        // Probleme bei der Darstellung von Elementen, welche über keine Kanten verfügen
        var result = new Diagram();
        
        
        let elementE1 = new Event("E1", "Start", EventType.Start);
        result.addElement(elementE1);

        let elementE2 = new Event("E2", "Start2", EventType.Start);
        result.addElement(elementE2);

        //  let elementE3 = new Event("E3", "Start3", EventType.Start);
        //  result.addElement(elementE3);

        let elementG1 = new Gateway("G1", GatewayType.OR_SPLIT);
        result.addElement(elementG1);
        let elementG3 = new Gateway("G3", GatewayType.OR_SPLIT);
        result.addElement(elementG3);

        let connector1: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementE1, elementG1);
        result.addEdge(elementE1, elementG1);
        result.addElement(connector1);

        let connector2: Connector = new Connector("A2", "", Connectortype.InformationFlow, elementE2, elementG1);
        result.addEdge(elementE2, elementG1);
        result.addElement(connector2);
        










        // let connector3: Connector = new Connector("A3", "", Connectortype.InformationFlow, elementE3, elementT1);
        // result.addEdge(elementE3, elementT1);
        // result.addElement(connector3);



        let elementG2 = new Gateway("G2", GatewayType.XOR_JOIN);
        result.addElement(elementG2);

        let elementG4 = new Gateway("G4", GatewayType.XOR_JOIN);
        result.addElement(elementG4);

        let elementT1 = new Task("T1", "Ende", TaskType.BusinessRule);
        result.addElement(elementT1);


        let connector3: Connector = new Connector("A3", "", Connectortype.InformationFlow, elementG1, elementG2);
        result.addEdge(elementE2, elementG2);
        result.addElement(connector3);

// //_-_

// let elementE20 = new Event("E20", "E20", EventType.Intermediate);
//         result.addElement(elementE20);
// //_-_




        let connector4: Connector = new Connector("A4", "", Connectortype.InformationFlow, elementG1, elementT1);
        result.addEdge(elementG1, elementT1);
        result.addElement(connector4);


        let elementT2 = new Task("T2", "T2", TaskType.BusinessRule);
        result.addElement(elementT2);


        let elementT3 = new Task("T3", "T3", TaskType.BusinessRule);
        result.addElement(elementT3);

        let connector5: Connector = new Connector("A5", "", Connectortype.InformationFlow, elementG2, elementT2);
        result.addEdge(elementE2, elementT2);
        result.addElement(connector5);

        let connector6: Connector = new Connector("A6", "", Connectortype.InformationFlow, elementG2, elementT3);
        result.addEdge(elementG1, elementT3);
        result.addElement(connector6);


        let connector7: Connector = new Connector("A7", "", Connectortype.InformationFlow, elementT2, elementG4);
        result.addEdge(elementT2, elementG4);
        result.addElement(connector7);

        let connector8: Connector = new Connector("A8", "", Connectortype.InformationFlow, elementT3, elementG4);
        result.addEdge(elementT3, elementG4);
        result.addElement(connector8);

        let connector9: Connector = new Connector("A9", "", Connectortype.InformationFlow, elementT1, elementG3);
        result.addEdge(elementT1, elementG3);
        result.addElement(connector9);

        let connector10: Connector = new Connector("A10", "", Connectortype.InformationFlow, elementG4, elementG3);
        result.addEdge(elementG4, elementG3);
        result.addElement(connector10);

        
        // let elementE63 = new Event("E3", "Ende", EventType.End);
        // result.addElement(elementE3);

        // let elementT31 = new Task("t1", "Hotel suchen", TaskType.Service);
        // result.addElement(elementT1);


        // let elementG11 = new Gateway("G1", GatewayType.OR_SPLIT);
        // result.addElement(elementG1);

        // let elementG2 = new Gateway("G2", GatewayType.OR_JOIN);
        // result.addElement(elementG2);

        // let connector334: Connector = new Connector("A1", "", Connectortype.InformationFlow, elementE1, elementG1);
        // result.addEdge(elementE1, elementG1);
        // result.addElement(connector);










        return result;
    }
}
