import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ParserService } from './services/parser.service';
import { DisplayService } from './services/display.service';
import { debounceTime, from, Subscription } from 'rxjs';
import { BpmnGraph } from './classes/Basic/Bpmn/BpmnGraph';
import { GraphValidationService } from "./services/graph-validation.service";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {

    mode = "free layout"
    public textareaFc: FormControl;
    private _sub: Subscription;
    private _sub1: Subscription;
    private result: any;
    graphIsValid: boolean = false;

    constructor(
        private _displayService: DisplayService,
        private _parserService: ParserService,
        private graphValidationService: GraphValidationService
    ) {
        this.textareaFc = new FormControl();
        this._sub = this.textareaFc.valueChanges
            .pipe(debounceTime(1000))
            .subscribe((val) => this.processSourceChange(val));
        this._sub1 = this._parserService.positionChange.
            pipe(debounceTime(400)).
            subscribe((val) => this.textareaFc.setValue(val));


        // this.textareaFc.setValue(`Your advertising could be here`);



let s : String = '.events\n'+
'e1 start "E1 Start1"\n'+
'e2 start "E2 Start2"\n'+
'e3 end\n'+
'\n'+
'.tasks\n'+
't1 manual "t1"\n'+
't2 usertask "T2"\n'+
't3 none "T3"\n'+
't4 usertask "T4"\n'+
't5 usertask "T5"\n'+
't6 usertask "T6"\n'+
't7 usertask "T7"\n'+
't8 usertask "T8"\n'+
't9 usertask "T9"\n'+
't10 manual "T10"\n'+
't11 service "T11"\n'+
't12 usertask "T12"\n'+
't13 manual "T13"\n'+
't14 usertask "T14"\n'+
't15 manual "T15"\n'+
't16 service "T16"\n'+
'\n'+
'.gateways\n'+
'g1J or_join "G1J"\n'+
'g2S or_split "G2S"\n'+
'g2J or_join "G2J"\n'+
'g3S and_split "G2S"\n'+
'g3J and_join "G3J"\n'+
'g4S or_split "G4S"\n'+
'g4J or_join "G4J"\n'+
'g5S and_split "G5S"\n'+
'g5J and_join "G5J"\n'+
'g6S xor_split "G6S"\n'+
'g6J xor_join\n'+
'g7S or_split\n'+
'g7J or_join\n'+
'\n'+
'.edges\n'+
'e1 t1 sequenceflow\n'+      
't1 g1J sequenceflow\n'+ 
'e2 g1J sequenceflow "a3"\n'+ 
'g1J t2 sequenceflow\n'+
't2 g2S sequenceflow\n'+
'g2S t3 sequenceflow\n'+
't3 g3S sequenceflow\n'+
'g3S t6 sequenceflow\n'+
't6 g6S sequenceflow\n'+
'g6S t7 sequenceflow\n'+
'g6S t8 sequenceflow "t8"\n'+
't7 t15 sequenceflow\n'+
't8 t16 sequenceflow\n'+
't15 g6J sequenceflow\n'+
't16 g6J sequenceflow\n'+
'g6J g3J sequenceflow\n'+
'g3S t9 sequenceflow\n'+
't9 g7S sequenceflow\n'+
'g7S t10 sequenceflow\n'+
'g7S t11 sequenceflow\n'+
't10 g7J sequenceflow\n'+
't11 g7J sequenceflow\n'+
'g7J g3J sequenceflow\n'+
'g2S g4S sequenceflow\n'+
'g4S t4 sequenceflow\n'+
't4 t12 sequenceflow\n'+
't12 g4J sequenceflow\n'+
'g4S t5 sequenceflow\n'+
't5 g5S sequenceflow\n'+
'g5S t13 sequenceflow\n'+
'g5S t14 sequenceflow\n'+
't13 g5J sequenceflow\n'+
't14 g5J sequenceflow\n'+
'g5J g4J sequenceflow\n'+
'g3J g2J sequenceflow\n'+
'g4J g2J sequenceflow\n'+
'g2J e3 sequenceflow';

console.log(s);
this.textareaFc.setValue(s);
    }
        

    ngOnDestroy(): void {
        this._sub.unsubscribe();
        //this._sub1.unsubscribe();
    }

    private processSourceChange(newSource: string) {
        this.graphIsValid = false
        this.result = this._parserService.parse(newSource);
        if (this.result) {

            if (this.result.nodes.length === 0)
                this.result = BpmnGraph.anotherMonsterGraph();
            this._displayService.display(this.result);
            this._parserService.afterSugiyamaLayout(this.result,newSource);
        }
    }

    validateGraph(): void {
        if (this.result !== undefined) {
            this.graphIsValid = this.graphValidationService.isValid(this.result);
        }
    }
}
