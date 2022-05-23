import {Injectable} from '@angular/core';
import {Diagram} from '../classes/diagram/diagram';
import {Element} from '../classes/diagram/element';
import { Gateway } from '../classes/diagram/elements/gateway';
import { Event } from '../classes/diagram/elements/event';

import { EventType } from '../classes/diagram/elements/eventtype';
import { GatewayType } from '../classes/diagram/elements/gatewaytype';
import { Task } from '../classes/diagram/elements/task';
import { TaskType } from '../classes/diagram/elements/tasktype';
import { Connector } from '../classes/diagram/elements/connector';
import { Connectortype } from '../classes/diagram/elements/connectortype';

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


    private testDiagramm() : Diagram {
        const result = new Diagram();
        var elementE1 = new Event("E1", "Start", EventType.Start);
        elementE1.x = 60;
        elementE1.y = 190;  
        result.addElement(elementE1);
    
        let elementE2 = new Event("E2", "", EventType.Intermediate);
        elementE2.x = 850;
        elementE2.y = 190; // 20     130      280
        result.addElement(elementE2);
    
    
        let elementE3 = new Event("E3", "Ende", EventType.End);
        elementE3.x = 1600;
        elementE3.y = 190; //  20     130      280
        result.addElement(elementE3);
    
    
    
             var elementT1 = new Task("t1","Hotel buchen", TaskType.Service);
             elementT1.x = 442;
             elementT1.y = 60; // 20     130      280
             result.addElement(elementT1);
    
            var elementT2 = new Task("t2","Flug buchen", TaskType.Manual);
            elementT2.x = 442;
            elementT2.y = 320; // 20     130      280
            result.addElement(elementT2);
    
            var elementT3 = new Task("t3","Drucken", TaskType.UserTask);
            elementT3.x = 1225;
            elementT3.y = 190; //  20     130      280
            result.addElement(elementT3);
    
            var elementG1 = new Gateway("G1",GatewayType.AND_SPLIT);
            elementG1.x = 210;
            elementG1.y = 190;  // 20     130      280
            result.addElement(elementG1); // XOR_JOIN OR_JOIN AND_JOIN
    
            var elementG2 = new Gateway("G2",GatewayType.AND_SPLIT);
            elementG2.x = 675;
            elementG2.y = 190; //  20     130      280
            result.addElement(elementG2); // XOR_JOIN OR_JOIN AND_JOIN
    
    
    
    
    
    
            var connector : Connector = new Connector("A1", "", Connectortype.InformationFlow, elementE1, elementG1); // Association     InformationFlow
            result.addEdge(elementE1, elementG1);
            result.addElement(connector);
    
            
            var connector : Connector = new Connector("A2", "", Connectortype.SequenceFlow, elementG1, elementT1);
            connector.addPathConnectorElement(210,60);
            result.addEdge(elementG1, elementT1);
            result.addElement(connector);
            
            var connector : Connector = new Connector("A3", "", Connectortype.InformationFlow, elementG1, elementT2);
            connector.addPathConnectorElement(210,320);
            result.addEdge(elementG1, elementT2);
            result.addElement(connector);
    
            var connector : Connector = new Connector("A4", "", Connectortype.Association, elementT1, elementG2);
            connector.addPathConnectorElement(675,60);
            result.addEdge(elementT1, elementG2);
            result.addElement(connector);
    
            var connector : Connector = new Connector("A5", "", Connectortype.InformationFlow, elementT2, elementG2);
            connector.addPathConnectorElement(675,320);
            result.addEdge(elementT2, elementG2);
            result.addElement(connector);
    
            var connector : Connector = new Connector("A6", "", Connectortype.InformationFlow, elementG2, elementE2);
            result.addEdge(elementG2, elementE2);
            result.addElement(connector)
    
            var connector : Connector = new Connector("A7", "", Connectortype.InformationFlow, elementE2, elementT3);
            result.addEdge(elementE2, elementT3);
            result.addElement(connector)
    
            var connector : Connector = new Connector("A8", "", Connectortype.InformationFlow, elementT3, elementE3);
            result.addEdge(elementT3, elementE3);
            result.addElement(connector)
    
    
    
            var connector : Connector = new Connector("A9", "", Connectortype.InformationFlow, elementE3, elementE2);
            connector.addPathConnectorElement(1600,60);
            connector.addPathConnectorElement(850,60);
            result.addEdge(elementE3, elementE2);
            result.addElement(connector);
            return result;
    }
}
