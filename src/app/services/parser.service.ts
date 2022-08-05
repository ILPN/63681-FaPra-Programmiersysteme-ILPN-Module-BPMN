import { Injectable, Output, EventEmitter} from '@angular/core';
import { BpmnDummyEdgeCorner } from '../classes/Basic/Bpmn/BpmnEdge/BpmnDummyEdgeCorner';
import { BpmnEdge } from '../classes/Basic/Bpmn/BpmnEdge/BpmnEdge';
import { BpmnEdgeCorner } from '../classes/Basic/Bpmn/BpmnEdge/BpmnEdgeCorner';
import { BpmnEdgeAssociation} from '../classes/Basic/Bpmn/BpmnEdge/BpmnEdgeAssociation'
import { BpmnEdgeDefault } from '../classes/Basic/Bpmn/BpmnEdge/BpmnEdgeDefault';
import { BpmnEdgeMessageflow } from '../classes/Basic/Bpmn/BpmnEdge/BpmnEdgeMessageflow';
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
import { DisplayErrorService } from './display-error.service';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    @Output() positionChange = new EventEmitter<string>();
    
    text:string[];
    result: BpmnGraph;
    
    constructor(private displayerrorService: DisplayErrorService) {
       this.text = [];
       this.result = new BpmnGraph();
    }

    /**
     * is called after draging or reordering if positions have been changed
     * @param nodes that have changed positions
     * @param dummyNodes that have changed positions
     * @param edgeStarts that have changed positions
     * @param edgeEnds that have changed positions
     */

    positionOfNodesAndEdgesChanged(nodes: BpmnNode[], dummyNodes: BpmnDummyEdgeCorner[], edgeStarts: BpmnEdgeCorner[], edgeEnds: BpmnEdgeCorner[]) {
        //@Vanessa

        for (const node of nodes) {
            if (this.text != []) {
                let newCoordString = "(" + node.getPos().x + "," + node.getPos().y + ")";
                let matchLine = this.text.find(line => line.startsWith(node.id));
                if(matchLine != undefined) {
                    let index = this.text.indexOf(matchLine);
                    let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                  
                    if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                        matchLineNew = matchLine.concat(" "+newCoordString);
                    }
                   
                    this.text[index] = matchLineNew;
                    console.log("new node position:"+ matchLineNew);
                }
                
            }
            for (const edge of node.inEdges){
                let newCoordString = "(" + edgeEnds[0].x + "," + edgeEnds[0].y + ")";
                let matchLine = this.text.find(line => line.startsWith(edge.id));

                if(matchLine != undefined) {
                    let index = this.text.indexOf(matchLine);
                    //zweite (to) node auswählen 
                    //dahinter: wenn schon was ist dann replacen. ansonsten neu rein

                    let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                    if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                        matchLineNew = matchLine.concat(" "+newCoordString);
                    }
                    this.text[index] = matchLineNew;
                    console.log("new incoming edge position:" + matchLineNew);
            }

        }

        for (const edge of node.outEdges){
            let newCoordString = "(" + edgeStarts[0].x + "," + edgeStarts[0].y + ")";
            let matchLine = this.text.find(line => line.startsWith(edge.id));

            if(matchLine != undefined) {
                let index = this.text.indexOf(matchLine);
                //erste (from) node auswählen
                //dahinter: wenn schon was ist dann replacen. ansonsten neu rein
                let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                const matches = matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/);
                if(matches === null) {
                    matchLineNew = matchLine.concat(" "+newCoordString);
                }
                this.text[index] = matchLineNew;
                console.log("new outgoing edge position:" + matchLineNew);
        }

    }

        let emitText = this.text.join("\n");
        this.positionChange.emit(emitText);
        
    }
}
    /**
     * this functions is called after the layout by the sugiyama algorithm has been done
     * and allows to override the positions set by the alogrithm
     */
    /* setHardcodedPositions(bpmnGraph: BpmnGraph) {
        //@Vanessa
        for (const node of bpmnGraph.nodes) {
            const id = node.id;
            let matchLine = this.text.find(line => line.startsWith(node.id));
                if(matchLine != undefined && matchLine.includes("(")) {
                    let re = /"[\w ]*"/;
                    matchLine = matchLine.replace(re, "");
                    let lineSplit = matchLine.split(" ");
                    if (lineSplit[3]) {
                        let coordinates = lineSplit[3];
                        let coord = coordinates.split(',');
                        coord[0] = coord[0].replace("(", "");
                        coord[1] = coord[1].replace(")", "");
                        let x = parseInt(coord[0]);
                        let y = parseInt(coord[1]);
                        console.log("setNodePos" + node.id + x + y);
                        node.setPosXY(x,y);   
                }}  
        }
            
              for (const edge of bpmnGraph.edges) {
                const id = edge.id;
                let matchLine = this.text.find(line => line.startsWith(edge.id));
                if(matchLine != undefined && matchLine.includes("(")) {
                    let sub = matchLine.substring(matchLine.indexOf("("));
                    while (sub != "") {
                        sub = sub.substring(sub.indexOf("(")+1,sub.indexOf(")"));
                        let coord = sub.split(',');
                        coord[0] = coord[0].replace("\r", "");
                        coord[1] = coord[1].replace("\r", "");;
                        let x = parseInt(coord[0]);
                        let y = parseInt(coord[1]);
                        console.log("adding corner:" + edge.id + x + y);
                        edge.addCornerXY(x,y); 
                        if(sub.includes("(")) {
                            sub = sub.substring(sub.indexOf("("));
                        }else sub = "";
                    }   
                }}     
        //console.log("read existing positions from text and set them to the nodes and edges")
    } */

    parse(text: string): BpmnGraph | undefined {
       
        console.log("parsing");

        const lines = text.split('\n');
        this.text = lines; 
        this.result = new BpmnGraph();

        let pos;
        let act = lines.find(el => el.startsWith(".activities"));
        if (act) {
            pos = lines.indexOf(act) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode|undefined = this.parseActivities(lines[pos]);
                if(el != undefined) {
                    this.result.addNode(el);
                }
                pos++;
            }
        }

        let evt = lines.find(el => el.startsWith(".events"));
        if (evt) {
            pos = lines.indexOf(evt) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode|undefined = this.parseEvents(lines[pos]);
                if(el != undefined) {
                    this.result.addNode(el);
                }
                pos++;
            }
        }

        let gateway = lines.find(el => el.startsWith(".gateways"));
        if (gateway) {
            pos = lines.indexOf(gateway) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode|undefined = this.parseGateways(lines[pos]);
                if(el != undefined) {
                    this.result.addNode(el);
                }
                pos++;
            }
        }

        let seq = lines.find(el => el.startsWith(".sequences"));
        if (seq) {
            pos = lines.indexOf(seq) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el:BpmnEdge|void = this.parseSequences(lines[pos]);
                if (typeof el === 'object') {
                    this.result.addEdge(el);
                } else {
                    console.log("nicht vorhandene Verbindungselemente bei einer Kante");
                }
                ;
                pos++;
            }
        }

        for(let i= 0; i < this.result.nodes.length; i++){
            console.log("pos:" + this.result.nodes[i].id + " " + this.result.nodes[i].x + " " + this.result.nodes[i].y);
        }

        for(let i= 0; i < this.result.edges.length; i++){
            let edge = this.result.edges[i];
            console.log("edge pos:" + edge.id + " ") 
            for(let j = 0; j < this.result.edges[i].corners.length; j++) {
                console.log("corners:" + edge.corners[j].x + " " + edge.corners[j].y);
            }
        }

        let choose: number = 1;
        switch (choose) {
            case 1:
                return this.result; // Textfeld aktiv
            case 2:
                return BpmnGraph.sampleGraph();
            case 3:
                return BpmnGraph.anotherGraph();
            case 4:
                return BpmnGraph.anotherMonsterGraph();
            case 5:
                return BpmnGraph.loopingLouieGraph();
            default:
                return this.result;

        }
    }


    private parseActivities(line: string): BpmnNode | undefined {
        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");
        const lineSplit = line.split(" ");

        const name = lineSplit[0];
        if(this.result.nodes.find(el => el.id === name) != undefined) {
            this.displayerrorService.displayError("Bezeichner " + name + " schon vergeben");
        }
        let activity = new BpmnTask(name);

        switch (lineSplit[1].toLowerCase()) {
            case ("sending"):
                activity = new BpmnTaskSending(name);
                break;
            case ("manual"):
                activity = new BpmnTaskManual(name);
                break;
            case ("service"):
                activity = new BpmnTaskService(name);
                break;
            case ("businessrule"):
                activity = new BpmnTaskBusinessRule(name);
                break;
            case ("receiving"):
                activity = new BpmnTaskReceiving(name);
                break;
            case ("usertask"):
                activity = new BpmnTaskUserTask(name);
                break;
            default: 
                this.displayerrorService.displayError("invalid activity type "+ lineSplit[1]);
        }

        activity.label = description;

        if (lineSplit[3]) {
            let coordinates = lineSplit[3];
            let coord = coordinates.split(',');
            coord[0] = coord[0].replace("(", "");
            coord[1] = coord[1].replace(")", "");
            let x = parseInt(coord[0]);
            let y = parseInt(coord[1]);
            activity.setPosXY(x, y);
        }
        return activity;
    }


    private parseEvents(line: string): BpmnNode|undefined {
        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");
        const lineSplit = line.split(" ");

        const name = lineSplit[0];
        if(this.result.nodes.find(el => el.id === name) != undefined) {
            this.displayerrorService.displayError("Bezeichner " + name + " schon vergeben");
            return;
        }
        let event = new BpmnEvent(name);

        switch (lineSplit[1].toLowerCase()) {
            case ("start"):
                event = new BpmnEventStart(name);
                break;
            case ("intermediate"):
                event = new BpmnEventIntermediate(name);
                break;
            case ("end"):
                event = new BpmnEventEnd(name);
                break;
            default: 
                this.displayerrorService.displayError("invalid event type '" + lineSplit[1] + "'");
        }

        event.label = description;

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

    private parseGateways(line: string): BpmnNode|undefined {
        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");

        const lineSplit = line.split(" ");

        const name = lineSplit[0];
        if(this.result.nodes.find(el => el.id === name) != undefined) {
            this.displayerrorService.displayError("Bezeichner " + name + " schon vergeben");
            return;
        }
        let gateway = new BpmnGateway(name);

        switch (lineSplit[1].toLowerCase()) {
            case ("and_join"):
                gateway = new BpmnGatewayJoinAnd(name);
                break;
            case ("and_split"):
                gateway = new BpmnGatewaySplitAnd(name);
                break;
            case ("or_join"):
                gateway = new BpmnGatewayJoinOr(name);
                break;
            case ("or_split"):
                gateway = new BpmnGatewaySplitOr(name);
                break;
            case ("xor_join"):
                gateway = new BpmnGatewayJoinXor(name);
                break;
            case ("xor_split"):
                gateway = new BpmnGatewaySplitXor(name);
                break;
            default: 
                this.displayerrorService.displayError("invalid gateway type " + lineSplit[1]); 
                return;
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

    private parseSequences(line: string): BpmnEdge | void {

        let description = line.split('"')[1];
        let re = /"[\w ]*"/;
        line = line.replace(re, "");
        const lineSplit = line.split(" ");

        const name = lineSplit[0];


        for (let i = 0; i < this.result.nodes.length; i++) {
            let node1 = this.result.nodes[i];
            if (node1.id === lineSplit[3].trim()) {
                for (let j = 0; j < this.result.nodes.length; j++) {
                    let node2 = this.result.nodes[j];
                    if (node2.id === lineSplit[4].trim()) {
                        let sequence = new BpmnEdge(name, node1, node2);

                        if(node1.constructor.name === 'BpmnGatewaySplitXor' && node2.constructor.name === 'BpmnGatewayJoinXor') {
                            sequence = new BpmnEdgeDefault(name,node1,node2);
                        } else switch(lineSplit[1].toLowerCase()){
                            case("sequenceflow"): sequence = new BpmnEdge(name,node1,node2); break;
                            case("association"): sequence = new BpmnEdgeAssociation(name,node1,node2); break;
                            case("informationflow"): sequence = new BpmnEdgeMessageflow(name,node1,node2); break;
                            default: this.displayerrorService.displayError("invalid connector type "+lineSplit[1]);
                        } 

                        //wenn bei den Verbindungsknoten Koordinaten angegeben sind, Ecken für die Kanten anlegen
                        let matchFrom = this.text.find(line => line.startsWith(node1.id));
                        if(matchFrom != undefined && matchFrom.match(/\(-?[0-9]*,-?[0-9]*\)/) != null) {
                            console.log("adding corner:" + node1.getPos().x + node1.getPos().y);
                            sequence.setStartPos(node1.getPos().x,node1.getPos().y);
                        }

                        let matchTo = this.text.find(line => line.startsWith(node2.id));
                        if(matchTo != undefined && matchTo.match(/\(-?[0-9]*,-?[0-9]*\)/) != null) {
                            console.log("adding corner:" + node2.getPos().x + node2.getPos().y);
                            sequence.setEndPos(node2.getPos().x,node2.getPos().y);
                        }
                        
                        /*
                        let i = 5;
                        while (lineSplit[i] && lineSplit[i] != undefined && !lineSplit[i].startsWith("\r")) {
                            let coordinates = lineSplit[i];
                            let coord = coordinates.split(',');
                            coord[0] = coord[0].replace("(", "").replace("\r", "");
                            coord[1] = coord[1].replace(")", "").replace("\r", "");
                            let x = parseInt(coord[0]);
                            let y = parseInt(coord[1]);
                            console.log("adding sequence from text");
                            sequence.addCornerXY(x, y);
                            i++;
                        }
                        */

                       
                        return sequence;
                    }; 
                }
            };

        }
    }
}
