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
import { LayoutService } from './layout.service';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { DisplayService } from './display.service';
import { FormValidationService } from './form-validation.service';
import { OutputFieldComponent } from '../components/output-field/output-field.component';
import { AppComponent } from '../app.component';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    @Output() positionChange = new EventEmitter<string>();
    @Output() textareaError = new EventEmitter<string>();
    
    private text:string[];
    private result!: BpmnGraph;
    private seqCount: number;

    constructor(private displayService:DisplayService,
        private displayerrorService: DisplayErrorService, 
        private formValidationService: FormValidationService,
        private layoutService:LayoutService)
         {
        this.layoutService.afterSugiyamaLayoutCallback = this.afterSugiyamaLayout;
        this.text = [];
       this.seqCount = 0;
    }

    /**
     * is called after draging or reordering if positions have been changed
     * @param nodes that have changed positions
     * @param edgeCorners that have changed positions
     */

    positionOfNodesAndEdgesChanged(nodes: BpmnNode[], edgeCorners: BpmnEdgeCorner[]) {
        //@Vanessa
        console.log(nodes)
        console.log(edgeCorners)

        for (const node of nodes) {

            if (this.text != []) {
                let newX = node.getPos().x.toFixed(0);
                let newY = node.getPos().y.toFixed(0);

                let newCoordString = "(" + newX + "," + newY + ")";
                if(!node.getPos().y) {
                    newCoordString = "(" + newX + "," + 0 + ")";
                }
                let matchLine = this.text.find(line => line.startsWith(node.id));
                if(matchLine != undefined) {
                    let index = this.text.indexOf(matchLine);

                    let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);

                    if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                        matchLineNew = matchLine.replace(/[\n\r]/,"").concat(" "+newCoordString);
                    }
                   
                    this.text[index] = matchLineNew;
                    //console.log("new node position:"+ matchLineNew);
                    
                }
                
            }

               /*for (const corner of edgeCorners) {
            const index = corner.edge.corners.findIndex(c => c==corner)
            console.log("corner at "+index)
            let newX = corner.x.toFixed(0);
            let newY = corner.y.toFixed(0);

            let newCoordString = "(" + newX + "," + newY + ")";
            if(!corner.y) {
                newCoordString = "(" + newX + "," + 0 + ")";
            }

            let matchLine = this.text.find(line => line.startsWith(corner.edge.fromId + " " + corner.edge.toId));

            if(matchLine != undefined) {
                let index = this.text.indexOf(matchLine);

                let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                    matchLineNew = matchLine.replace(/[\n\r]/,"").concat(" "+newCoordString);
                }

                this.text[index] = matchLineNew;

            }
        }*/
        
            /*
            for (const edge of node.inEdges){
                if(edgeEnds){
                let newCoordString = "(" + edgeEnds[0].x + "," + edgeEnds[0].y + ")";
                let matchLine = this.text.find(line => line.startsWith(edge.id));

                if(matchLine != undefined) {
                    let index = this.text.indexOf(matchLine);

                    let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                    if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                        matchLineNew = matchLine.replace(/[\n\r]/,"").concat(" "+newCoordString);
                    }


                    this.text[index] = matchLineNew;
                    //console.log("new incoming edge position:" + matchLineNew);
            }}

        }

        for (const edge of node.outEdges){
            if(edgeStarts){
            let newCoordString = "(" + edgeStarts[0].x + "," + edgeStarts[0].y + ")";
            let matchLine = this.text.find(line => line.startsWith(edge.id));

            if(matchLine != undefined) {
                let index = this.text.indexOf(matchLine);
                let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                const matches = matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/);
                if(matches === null) {
                    matchLineNew = matchLine.concat(" "+newCoordString);
                }
                this.text[index] = matchLineNew;
                //console.log("new outgoing edge position:" + matchLineNew);
        }

        }}
        */
        let emitText = this.text.join("\n");
        this.positionChange.emit(emitText);

    }
}

    /**
     * this functions is called after the layout by the sugiyama algorithm has been done
     * and allows to override the positions set by the alogrithm
     */

    afterSugiyamaLayout(bpmnGraph: BpmnGraph, text: string){
        let nodes = bpmnGraph.nodes;
        let edges = bpmnGraph.edges;

        for(const edge of edges){
            let line = this.text.find(line => line.startsWith(edge.fromId +" "+ edge.toId));
                if(line != undefined) {
                    let matched = line.match(/\(-?[0-9]*,-?[0-9]*\)/);
                    if(matched){
                        let currentLine = line;
                        for(let i = 0;i<edge.corners.length;i++){
                            console.log(i);
                            console.log(currentLine);
                            let coordinates = currentLine.substring(currentLine.indexOf("("),currentLine.indexOf(")")+1);
                            console.log(coordinates)
                            let coord = coordinates.split(',');
                            console.log(coord);
                            coord[0] = coord[0].replace("(", "");
                            coord[1] = coord[1].replace(")", "");
                            let x = parseInt(coord[0]);
                            let y = parseInt(coord[1]);
                            edge.corners[i].setPosXY(x,y);
                            console.log("set position of corner:" + x +" "+ y);
                            currentLine = currentLine.replace(coordinates,"");
                    }}
                }
        }

        for (const node of nodes) {
                //wenn Koordinaten angegeben sind, dann rein in bpmnGraph
                let line = this.text.find(line => line.startsWith(node.id));
                if(line != undefined) {
                    let matched = line.match(/\(-?[0-9]*,-?[0-9]*\)/);
                    if(matched){
                        let coordinates = line.substring(line.indexOf("("));
                        let coord = coordinates.split(',');
                        coord[0] = coord[0].replace("(", "");
                        coord[1] = coord[1].replace(")", "");
                        let x = parseInt(coord[0]);
                        let y = parseInt(coord[1]);
                        node.setPosXY(x,y);
                        for (const edge of node.inEdges){
                            edge.setEndPos(x,y);
                        }
                        for (const edge of node.outEdges) {
                            edge.setStartPos(x,y);
                        }
                    } 
                }
          
        }

       
        this.displayService.displayOnly(bpmnGraph);
    }
    
    //called when sugiyama layout is selected
    resetCoordinates() {
        for(let i = 0; i < this.text.length; i++) {
            this.text[i] = this.text[i].replace(/\(-?[0-9]*,-?[0-9]*\)/,"");
        }
        let emitText = this.text.join("\n");

        this.positionChange.emit(emitText);
    }

    parse(text: string): BpmnGraph | undefined {

        console.log("parsing");
        
        const lines = text.split('\n');
        this.text = lines; 
        this.result = new BpmnGraph();

        let pos;
        let act = lines.find(el => el.startsWith(".tasks"));
        if (act) {
            pos = lines.indexOf(act) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el: BpmnNode|undefined = this.parseTasks(lines[pos]);
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

        let seq = lines.find(el => el.startsWith(".edges"));
        if (seq) {
            pos = lines.indexOf(seq) + 1;
            while (pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let el:BpmnEdge|void = this.parseEdges(lines[pos]);
                if (typeof el === 'object') {
                    this.result.addEdge(el);
                } 
                ;
                pos++;
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


    private parseTasks(line: string): BpmnNode | undefined {

        let description = "";
        if(line.includes('"')) {
            description = line.split('"')[1];
            let re = /"[\w ]*"/;
            line = line.replace(re,description.split(" ").join(""));
        };

        const lineSplit = line.split(" ");
        for(let i = 0;  i < lineSplit.length; i++){
            lineSplit[i] = lineSplit[i].replace(/[\n\r]/,"");
        }
        const name = lineSplit[0];
        if(this.result.nodes.find(el => el.id === name) != undefined) {
            this.textareaError.emit("Bezeichner " + name + " schon vergeben");
            return;
        }
        let activity = new BpmnTask(name);

        if(lineSplit[1] && !lineSplit[1].startsWith("(") && !(lineSplit[1] === description.split(" ").join(""))){
            let type = lineSplit[1];
            switch (type.toLowerCase()) {
            case ("sending"):{
                activity = new BpmnTaskSending(name);
                break;
            }
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
                this.textareaError.emit("Ungültiger Task Typ bei "+ name + ": " + type);
        }}

        if(description) activity.label = description;

        return activity;
    }


    private parseEvents(line: string): BpmnNode|undefined {
        let description = "";
        if(line.includes('"')) {
            description = line.split('"')[1];
            let re = /"[\w ]*"/;
            line = line.replace(re,description.split(" ").join(""));
        };

        const lineSplit = line.split(" ");
        for(let i = 0;  i < lineSplit.length; i++){
            lineSplit[i] = lineSplit[i].replace(/[\n\r]/,"");
        }

        const name = lineSplit[0];
        if(this.result.nodes.find(el => el.id === name) != undefined) {
            this.textareaError.emit("Bezeichner " + name + " schon vergeben");
            return;
        }
        let event = new BpmnEvent(name);

        const type = lineSplit[1];
        switch (type.toLowerCase()) {
            case ("start"):{
                event = new BpmnEventStart(name);
                break;}
            case ("intermediate"):{
                event = new BpmnEventIntermediate(name);
                break;}
            case ("end"):{
                event = new BpmnEventEnd(name);
                break;}
            default: 
                this.textareaError.emit("Ungültiger Event Typ bei " + name + ": " + type);
        }

        if(description) event.label = description;

        return event;
    }

    private parseGateways(line: string): BpmnNode|undefined {
        let description = "";
        if(line.includes('"')) {
            description = line.split('"')[1];
            let re = /"[\w ]*"/;
            line = line.replace(re,description.split(" ").join(""));
        };

        const lineSplit = line.split(" ");
        for(let i = 0;  i < lineSplit.length; i++){
            lineSplit[i] = lineSplit[i].replace(/[\n\r]/,"");
        }
        const name = lineSplit[0];
        if(this.result.nodes.find(el => el.id === name) != undefined) {
            this.textareaError.emit("Bezeichner " + name + " schon vergeben");
            return;
        }
        let gateway = new BpmnGateway(name);

        let type = lineSplit[1];
        switch (type.toLowerCase()) {
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
                this.textareaError.emit("Ungültiger Gateway Typ bei " + name + ": " + type); 
        }
        if(description) gateway.label = description;
        return gateway;

    }

    private parseEdges(line: string): BpmnEdge | void {

        let description = "";
        if(line.includes('"')) {
            description = line.split('"')[1];
            let re = /"[\w ]*"/;
            line = line.replace(re,description.split(" ").join(""));
        };

        const lineSplit = line.split(" ");
        for(let i = 0;  i < lineSplit.length; i++){
            lineSplit[i] = lineSplit[i].replace(/[\n\r]/,"");
        }
        const name = this.seqCount.toString();
        
        let type = lineSplit[2];
        if(type.includes("\\")){
            type = type.substring(0,type.indexOf("\\"));
        }

        for (let i = 0; i < this.result.nodes.length; i++) {
            let node1 = this.result.nodes[i];
            if (node1.id === lineSplit[0].trim()) {
                for (let j = 0; j < this.result.nodes.length; j++) {
                    let node2 = this.result.nodes[j];
                    if (node2.id === lineSplit[1].trim()) {
                        let sequence = new BpmnEdge(name, node1, node2);

                            switch(type.toLowerCase()){
                            case("defaultflow"): sequence = new BpmnEdgeDefault(name,node1,node2); break;
                            case("sequenceflow"): sequence = new BpmnEdge(name,node1,node2); break;
                            case("association"): sequence = new BpmnEdgeAssociation(name,node1,node2); break;
                            case("informationflow"): sequence = new BpmnEdgeMessageflow(name,node1,node2); break;
                            default: this.textareaError.emit("Ungültiger Edge Typ bei " + node1.id + " " +node2.id + ": "+ type);
                        }
                        if(description) sequence.labelMid = description;
                        
                        this.seqCount++;
                        return sequence;
                    }; 
                }
            };

        }
        //wenn beide Knoten angegeben sind, aber keine edge zurückgegeben wurde
        //--> fehlerhafte Knotenangabe
        if(lineSplit[0] && lineSplit[1]) {
            this.textareaError.emit("Fehlender Knoten bei edge: " + lineSplit[0] + " " + lineSplit[1]);
           
        }
    }
}
