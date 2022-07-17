import { Injectable } from '@angular/core';
import { BpmnEdge } from '../classes/Basic/Bpmn/BpmnEdge/BpmnEdge';
import { BpmnGraph } from '../classes/Basic/Bpmn/BpmnGraph';
import { BpmnNode } from '../classes/Basic/Bpmn/BpmnNode';
import { BpmnEvent } from '../classes/Basic/Bpmn/events/BpmnEvent';
import { BpmnEventEnd } from '../classes/Basic/Bpmn/events/BpmnEventEnd';
import { BpmnEventIntermediate } from '../classes/Basic/Bpmn/events/BpmnEventIntermediate';
import { BpmnEventStart } from '../classes/Basic/Bpmn/events/BpmnEventStart';
import { BpmnGateway } from '../classes/Basic/Bpmn/gateways/BpmnGateway';
import { BpmnGatewayJoinAnd } from '../classes/Basic/Bpmn/gateways/BpmnGatewayJoinAnd';
import { BpmnGatewayJoinOr } from '../classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr';
import { BpmnGatewayJoinXor } from '../classes/Basic/Bpmn/gateways/BpmnGatewayJoinXor';
import { BpmnGatewaySplitAnd } from '../classes/Basic/Bpmn/gateways/BpmnGatewaySplitAnd';
import { BpmnGatewaySplitOr } from '../classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr';
import { BpmnGatewaySplitXor } from '../classes/Basic/Bpmn/gateways/BpmnGatewaySplitXor';
import { BpmnTask } from '../classes/Basic/Bpmn/tasks/BpmnTask';
import { BpmnTaskBusinessRule } from '../classes/Basic/Bpmn/tasks/BpmnTaskBusinessRule';
import { BpmnTaskManual } from '../classes/Basic/Bpmn/tasks/BpmnTaskManual';
import { BpmnTaskReceiving } from '../classes/Basic/Bpmn/tasks/BpmnTaskReceiving';
import { BpmnTaskSending } from '../classes/Basic/Bpmn/tasks/BpmnTaskSending';
import { BpmnTaskService } from '../classes/Basic/Bpmn/tasks/BpmnTaskService';
import { BpmnTaskUserTask } from '../classes/Basic/Bpmn/tasks/BpmnTaskUserTask';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
       
    }
    positionOfNodesChanged(nodes:BpmnNode[]){
        console.log(nodes)
    }

    parse(text: string): BpmnGraph | undefined {
        const result = new BpmnGraph();
        const nodes = new Array<BpmnNode>();

        console.log("parsing");

        const lines = text.split('\n');

        let pos;
        let act = lines.find(el => el.startsWith(".activities"));
        if (act) {
            pos = lines.indexOf(act) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode = this.parseActivities(lines[pos]);
                nodes.push(el);
                result.addNode(el);
                pos++;
            }
        }

        let evt = lines.find(el => el.startsWith(".events"));
        if (evt) {
            pos = lines.indexOf(evt) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode = this.parseEvents(lines[pos]);
                nodes.push(el);
                result.addNode(el);
                pos++;
            }
        }

        let gateway = lines.find(el => el.startsWith(".gateways"));
        if (gateway) {
            pos = lines.indexOf(gateway) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode = this.parseGateways(lines[pos]);
                nodes.push(el);
                result.addNode(el);
                pos++;
            }
        }

        let seq = lines.find(el => el.startsWith(".sequences"));
        if (seq) {
            pos = lines.indexOf(seq) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el = this.parseSequences(lines[pos],nodes);
                if (typeof el === 'object') {
                    result.addEdge(el);
                } else {
                    console.log("nicht vorhandene Verbindungselemente bei" + el);
                };
                pos++;
            }
        }


        let choose: number = 1;
        switch (choose) {
            case 1:
                return result; // Textfeld aktiv
            case 2:
                return BpmnGraph.sampleGraph();
            case 3:
                return BpmnGraph.anotherGraph();
            case 4:
                return BpmnGraph.anotherMonsterGraph();
            case 5:
                return BpmnGraph.loopingLouieGraph();
            default:
                return result;
                
        }
    }


    private parseActivities(line: string): BpmnNode {
        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");
        const lineSplit = line.split(" ");

        const name = lineSplit[0];
        let activity = new BpmnTask(name);

        switch (lineSplit[1].toLowerCase()) {
            case ("sending"): activity = new BpmnTaskSending(name); break;
            case ("manual"): activity = new BpmnTaskManual(name); break;
            case ("service"): activity = new BpmnTaskService(name); break;
            case ("businessrule"): activity = new BpmnTaskBusinessRule(name); break;
            case ("receiving"): activity = new BpmnTaskReceiving(name); break;
            case ("usertask"): activity = new BpmnTaskUserTask(name); break;
        }

        activity.label = description;

        console.log("name:" + name + "description:" + description);

        if (lineSplit[3]) {
            let coordinates = lineSplit[3];
            let coord = coordinates.split(',');
            coord[0] = coord[0].replace("(", "");
            coord[1] = coord[1].replace(")", "");
            let x = parseInt(coord[0]);
            let y = parseInt(coord[1]);
            activity.setPosXY(x, y);
            console.log("x: " + x + "y: " + y);
        }
        return activity;
    }


    private parseEvents(line: string): BpmnNode {
        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");
        const lineSplit = line.split(" ");

        const name = lineSplit[0];
        let event = new BpmnEvent(name);

        switch (lineSplit[1].toLowerCase()) {
            case ("start"): event = new BpmnEventStart(name); break;
            case ("intermediate"): event = new BpmnEventIntermediate(name); break;
            case ("end"): event = new BpmnEventEnd(name); break;
        }
        
        event.label = description;

        console.log("name:" + name + "description:" + description);
        if (lineSplit[3]) {
            let coordinates = lineSplit[3];
            let coord = coordinates.split(',');
            coord[0] = coord[0].replace("(", "");
            coord[1] = coord[1].replace(")", "");
            let x = parseInt(coord[0]);
            let y = parseInt(coord[1]);
            event.setPosXY(x, y);
        }
        return event;
    }

    private parseGateways(line: string): BpmnNode {
        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");

        const lineSplit = line.split(" ");
        const name = lineSplit[0];
        let gateway = new BpmnGateway(name);
        switch (lineSplit[1].toLowerCase()) {
            case ("and_join"): gateway = new BpmnGatewayJoinAnd(name); break;
            case ("and_split"): gateway = new BpmnGatewaySplitAnd(name); break;
            case ("or_join"): gateway = new BpmnGatewayJoinOr(name); break;
            case ("or_split"): gateway = new BpmnGatewaySplitOr(name); break;
            case ("xor_join"): gateway = new BpmnGatewayJoinXor(name); break;
            case ("xor_split"): gateway = new BpmnGatewaySplitXor(name); break;
        }
        gateway.label = description; 

        if (lineSplit[3]) {
            let coordinates = lineSplit[3];
            let coord = coordinates.split(',');
            coord[0] = coord[0].replace("(", "");
            coord[1] = coord[1].replace(")", "");
            let x = parseInt(coord[0]);
            let y = parseInt(coord[1]);
            gateway.setPosXY(x, y);
        }
        return gateway;

    }

    private parseSequences(line: string, elements: Array<BpmnNode>): BpmnEdge | void {

        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");
        const lineSplit = line.split(" ");

        const name = lineSplit[0];

        /* 
        switch(lineSplit[1].toLowerCase()){
            case("sequenceflow"): type = Connectortype.SequenceFlow; break;
            case("association"): type = Connectortype.Association; break;
            case("informationflow"): type = Connectortype.InformationFlow; break;
        } */
        let var1: BpmnNode;
        let var2: BpmnNode;

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === lineSplit[3].trim()) {
                var1 = elements[i];
                for (let j = 0; j < elements.length; j++) {
                    if (elements[j].id === lineSplit[4].trim()) {
                        var2 = elements[j];
                        console.log("sequence:" + var1.id + var2.id);
                        let sequence = new BpmnEdge(name, var1, var2);

                        let i = 5; 
                        while (lineSplit[i] && lineSplit[i] != undefined && !lineSplit[i].startsWith("\r")) {
                            console.log(lineSplit[i]);
                            let coordinates = lineSplit[i];
                            let coord = coordinates.split(',');
                            console.log("0:" + coord[0] + "1:" + coord[1]);
                            coord[0] = coord[0].replace("(", "").replace("\r", "");
                            coord[1] = coord[1].replace(")", "").replace("\r", "");;
                            let x = parseInt(coord[0]);
                            let y = parseInt(coord[1]);
                            sequence.addCornerXY(x,y);
                            i++;
                        } 
                          return sequence;
                    }
                }
            }

        }
    }
}
