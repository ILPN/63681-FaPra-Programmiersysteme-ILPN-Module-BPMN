import { BpmnEdge } from "src/app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import { BpmnGraph } from "src/app/classes/Basic/Bpmn/BpmnGraph";
import { BpmnNode } from "src/app/classes/Basic/Bpmn/BpmnNode";
import { BpmnEventEnd } from "src/app/classes/Basic/Bpmn/events/BpmnEventEnd";
import { BpmnEventIntermediate } from "src/app/classes/Basic/Bpmn/events/BpmnEventIntermediate";
import { BpmnEventStart } from "src/app/classes/Basic/Bpmn/events/BpmnEventStart";
import { BpmnGatewayJoinOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import { BpmnGatewaySplitOr } from "src/app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import { BpmnTaskManual } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import { BpmnTaskSending } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskSending";
import { BpmnTaskService } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import { BpmnTaskUserTask } from "src/app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";
import { TestGraph } from "./TestGraph";

export class DirectSplitJoinOr extends TestGraph {


    create(): BpmnGraph {

        //startEvent --> SPLIT_OR
        let startEvent = this.createNode(new BpmnEventStart("StartEvent"), "Reiseplanung genehmigt");
        let gatewaySplitOr = this.createNode(new BpmnGatewaySplitOr("GatewaySplitOr"), "");
        this.graph.addEdge(new BpmnEdge("1", startEvent, gatewaySplitOr));

        //SPLIT_OR --> task1 Flug suchen
        let task1 = this.createNode(new BpmnTaskManual("Task1"), "Flug suchen");
        this.graph.addEdge(new BpmnEdge("2", gatewaySplitOr, task1));

        //task1 Flug suchen --> task3 Flug buchen
        let task3 = this.createNode(new BpmnTaskSending("Task3"), "Flug buchen");
        this.graph.addEdge(new BpmnEdge("3", task1, task3));

        //task3 Flug buchen --> eventIntermed1 Buchungsbestätigung
        let eventIntermed1 = this.createNode(new BpmnEventIntermediate("EventInterm1"), "Buchungsbestätigung erhalten");
        this.graph.addEdge(new BpmnEdge("4", task3, eventIntermed1));

        //eventIntermed1 Buchungsbestätigung --> JOIN_OR
        let gatewayJoinOr = this.createNode(new BpmnGatewayJoinOr("GatewayJoinOr"), "");
        this.graph.addEdge(new BpmnEdge("5", eventIntermed1, gatewayJoinOr));


        //SPLIT_OR --> task2 Hotel suchen
        let task2 = this.createNode(new BpmnTaskManual("Task2"), "Hotel suchen");
        this.graph.addEdge(new BpmnEdge("6", gatewaySplitOr, task2));


        //task2 Hotel suchen --> task4 Hotel buchen
        let task4 = this.createNode(new BpmnTaskSending("Task4"), "Hotel buchen");
        this.graph.addEdge(new BpmnEdge("7", task2, task4));

        //task4 Flug buchen --> eventIntermed2 Buchungsbestätigung
        let eventIntermed2 = this.createNode(new BpmnEventIntermediate("EventInterm2"), "Buchungsbestätigung erhalten");
        this.graph.addEdge(new BpmnEdge("8", task4, eventIntermed2));

        //eventIntermed2 Buchungsbestätigung --> JOIN_OR
        this.graph.addEdge(new BpmnEdge("9", eventIntermed2, gatewayJoinOr));

        //SPLIT_OR --> JOIN OR
        this.graph.addEdge(new BpmnEdge("10", gatewaySplitOr, gatewayJoinOr));

        //JOIN_OR --> task5 Reiseunterlagen
        let task5 = this.createNode(new BpmnTaskService("Task5"), "Reiseunterlagen speichern");
        this.graph.addEdge(new BpmnEdge("11", gatewayJoinOr, task5));

        //task5 --> EndEvent
        let endEvent =  this.createNode(new BpmnEventEnd("EndEvent1"), "Reise gebucht");
        this.graph.addEdge(new BpmnEdge("12", task5, endEvent));

        return this.graph
    }
}

