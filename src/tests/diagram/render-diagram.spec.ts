import {BpmnGraph} from "../../app/classes/Basic/Bpmn/BpmnGraph";
import {DisplayService} from "../../app/services/display.service";
import {ParserService} from "../../app/services/parser.service";
import {BpmnEventStart} from "../../app/classes/Basic/Bpmn/events/BpmnEventStart";
import {BpmnEventIntermediate} from "../../app/classes/Basic/Bpmn/events/BpmnEventIntermediate";
import {BpmnEventEnd} from "../../app/classes/Basic/Bpmn/events/BpmnEventEnd";
import {BpmnEdge} from "../../app/classes/Basic/Bpmn/BpmnEdge/BpmnEdge";
import {BpmnTaskService} from "../../app/classes/Basic/Bpmn/tasks/BpmnTaskService";
import {BpmnTaskManual} from "../../app/classes/Basic/Bpmn/tasks/BpmnTaskManual";
import {BpmnTaskBusinessRule} from "../../app/classes/Basic/Bpmn/tasks/BpmnTaskBusinessRule";
import {BpmnTaskUserTask} from "../../app/classes/Basic/Bpmn/tasks/BpmnTaskUserTask";
import {BpmnGatewaySplitOr} from "../../app/classes/Basic/Bpmn/gateways/BpmnGatewaySplitOr";
import {BpmnGatewayJoinOr} from "../../app/classes/Basic/Bpmn/gateways/BpmnGatewayJoinOr";
import {BpmnEdgeDefault} from "../../app/classes/Basic/Bpmn/BpmnEdge/BpmnEdgeDefault";
import {AppComponent} from "../../app/app.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";


describe('render-diagram', () => {
    let appComponent: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let appComponentDebugElement: DebugElement;
    let displayService: DisplayService;
    let parserService: ParserService;
    let validGraph: string;
    let sampleGraph: string;
    const validGraphBpmnGraph: BpmnGraph = new BpmnGraph();


    beforeAll(() => {
        validGraph = '.events\n' +
            'e1 start "Start" (60,190)\n' +
            'e2 intermediate "BpmnEventIntermediate" (850,190)\n' +
            'e3 end "BpmnEventEnd" (1600,190)\n' +
            '\n' +
            '.activities\n' +
            't1 service "BpmnTaskService" (442,60)\n' +
            't2 manual "BpmnTaskManual" (442,320)\n' +
            't3 usertask "BpmnTaskUser" (1225,190)\n' +
            '\n' +
            '.gateways \n' +
            'g1 or_split (210,190)\n' +
            'g2 or_join (675,190)\n' +
            '\n' +
            '.sequences\n' +
            'connector sequenceflow "1" e1 g1 \n' +
            'pfeil sequenceflow "p2" g1 t1\n' +
            'connector2 sequenceflow "p3" g1 t2 (210,320)\n' +
            'connector3 sequenceflow "a4" t1 g2 (675,60)\n' +
            'connector4 sequenceflow "a5" t2 g2 (675,320)\n' +
            'connector5 sequenceflow "a6" g2 e2 \n' +
            'connector6 sequenceflow "a7" e2 t3\n' +
            'connector7 sequenceflow "a8" t3 e3';


        sampleGraph = '.events\n' +
            'e1 start "Am Start" (60,190)\n' +
            'e2 intermediate "BpmnEventIntermediate" (850,190)\n' +
            'e3 end "BpmnEventEnd" (1600,190)\n' +
            'ee3 end "ende gelaende" (1600,190)\n' +
            '\n' +
            '.activities\n' +
            't1 service "BpmnTaskService" (442,60)\n' +
            't2 manual "BpmnTaskManual" (442,320)\n' +
            't3 usertask "BpmnTaskUser" (1225,190)\n' +
            '\n' +
            '.gateways \n' +
            'g1 or_split (210,190)\n' +
            'g2 or_join (675,190)\n' +
            '\n' +
            '.sequences\n' +
            'coupou sequenceflow "1vvv" ee3 e3\n' +
            'connector sequenceflow "1" e1 g1 \n' +
            'pfeil sequenceflow "p2" g1 t1\n' +
            'connector2 sequenceflow "p3" g1 t2 (210,320)\n' +
            'connector3 sequenceflow "a4" t1 g2 (675,60)\n' +
            'connector4 sequenceflow "a5" t2 g2 (675,320)\n' +
            'connector5 sequenceflow "a6" g2 e2 \n' +
            'connector6 sequenceflow "a7" e2 t3\n' +
            'connector7 sequenceflow "a8" t3 e3\n' +
            '\n' +
            '\n' +
            '\n';


        let e1 = new BpmnEventStart("E1");
        e1.label = "Am Start!"
        e1.setPosXY(60, 190);
        validGraphBpmnGraph.addNode(e1);

        let elementE2 = new BpmnEventIntermediate("E2");
        elementE2.label = "BpmnEventIntermediate"
        elementE2.setPosXY(850, 190);
        validGraphBpmnGraph.addNode(elementE2);

        let elementE3 = new BpmnEventEnd("E3");
        elementE3.setPosXY(1600, 190)
        elementE3.label = "BpmnEventEnd"
        validGraphBpmnGraph.addNode(elementE3);


        let elementT1 = new BpmnTaskService("t1");
        elementT1.setPosXY(442, 60)
        elementT1.label = "BpmnTaskService"

        validGraphBpmnGraph.addNode(elementT1);

        let elementT2 = new BpmnTaskManual("t2");
        elementT2.label = "BpmnTaskService"

        elementT2.setPosXY(442, 320);
        validGraphBpmnGraph.addNode(elementT2);

        let tb2 = new BpmnTaskBusinessRule("tb2");
        tb2.label = "BpmnTaskBusinessRule"
        validGraphBpmnGraph.addNode(tb2);

        let elementT3 = new BpmnTaskUserTask("t3");
        elementT3.label = "BpmnTaskUserTask"

        elementT3.setPosXY(1225, 190)
        validGraphBpmnGraph.addNode(elementT3);

        let elementG1 = new BpmnGatewaySplitOr("G1");
        elementG1.label = "BpmnGateway"

        elementG1.setPosXY(210, 190);
        validGraphBpmnGraph.addNode(elementG1);

        let elementG2 = new BpmnGatewayJoinOr("G2");
        elementG2.label = "BpmnGateway"


        elementG2.setPosXY(675, 190);
        validGraphBpmnGraph.addNode(elementG2);

        let connector = new BpmnEdge("1", e1, elementG1);
        validGraphBpmnGraph.addEdge(connector);

        let pfeil = new BpmnEdge("p2", elementG1, elementT1);
        validGraphBpmnGraph.addEdge(pfeil);

        let connector2: BpmnEdge = new BpmnEdge("p3", elementG1, elementT2);
        connector2.addCornerXY(210, 320);

        validGraphBpmnGraph.addEdge(connector2);

        let connector3: BpmnEdge = new BpmnEdge("A4", elementT1, elementG2);
        connector3.addCornerXY(675, 60);
        validGraphBpmnGraph.addEdge(connector3);

        let connector4 = new BpmnEdge("A5", elementT2, elementG2);
        connector4.addCornerXY(675, 320);
        validGraphBpmnGraph.addEdge(connector4);

        let connector5 = new BpmnEdgeDefault("A6", elementG2, elementE2);
        validGraphBpmnGraph.addEdge(connector5)

        let connector6 = new BpmnEdge("A7", elementE2, elementT3);
        validGraphBpmnGraph.addEdge(connector6)

        let connector7 = new BpmnEdge("A8", elementT3, elementE3);
        validGraphBpmnGraph.addEdge(connector7)
        connector7.labelStart = "One"
        connector7.labelEnd = "Three"

        let connector8 = new BpmnEdge("A9", elementE3, elementE2);
        connector8.addCornerXY(1600, 60);
        connector8.addCornerXY(850, 60);
        connector8.labelStart = "Start"
        connector8.labelMid = "Mid"
        connector8.labelEnd = "End"
        validGraphBpmnGraph.addEdge(connector8);


    });

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [DisplayService, ParserService]
        });
        fixture = TestBed.createComponent(AppComponent);
        appComponent = fixture.componentInstance;
        appComponentDebugElement = fixture.debugElement;
        displayService = appComponentDebugElement.injector.get(DisplayService);
        parserService = appComponentDebugElement.injector.get(ParserService);
        appComponentDebugElement
        .query(By.css('div input-field'))
        .triggerEventHandler('click', validGraph);
    });


    it('should create AppComponent', () => {
        expect(appComponent).toBeTruthy();
    });

    it('should render fileinput', () => {
        appComponentDebugElement
        .query(By.css('div input-field'))
        .triggerEventHandler('click', validGraph);
        fixture.detectChanges();

        let textarea = appComponentDebugElement.query(By.css('mat-form-field textarea'));
        let componentInstance = textarea.componentInstance.valueOf();
        console.log("inhalt: ");
        console.log(textarea.nativeElement);
        console.log(textarea.attributes);

    });

    // todo: funktioniert nicht
    xit('should parse string of validGraph', () => {
            console.log('stop');
            parserService.parse(sampleGraph);
            parserService.parse(validGraph);
        }
    );

    // xit('AppComponent should have been called processSourceChange', () => {
    //     appComponent.textareaFc.setValue(validGraph);
    //     expect(appComponent.processSourceChange).toHaveBeenCalled()
    // });

    xit('DisplayService should have been called', () => {
        appComponent.textareaFc.setValue(validGraph);
        displayService.display(validGraphBpmnGraph);
        // expect(displayService1.display).toHaveBeenCalled()
    });
});
