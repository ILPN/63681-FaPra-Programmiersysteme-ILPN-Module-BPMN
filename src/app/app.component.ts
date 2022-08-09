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

    mode = "free dragging"
    public textareaFc: FormControl;
    private _sub: Subscription;
    //private _sub1: Subscription;
    private result: any;
    graphIsValid: boolean = false;

    constructor(
        private _displayService: DisplayService,
        private _parserService: ParserService,
        private graphValidationService: GraphValidationService
    ) {
        this.textareaFc = new FormControl();
        this._sub = this.textareaFc.valueChanges
            .pipe(debounceTime(400))
            .subscribe((val) => this.processSourceChange(val));
        /*this._sub1 = this._parserService.positionChange.
            pipe(debounceTime(400)).
            subscribe((val) => this.textareaFc.setValue(val));*/


        // this.textareaFc.setValue(`Your advertising could be here`);



let s : String = '.events\n'+
'e1 start "E1 Start1"\n'+
'e2 start "E2 Start2"\n'+
'e3 end "E3 Ende"\n'+
'\n'+
'.activities\n'+
't1 none "T1"\n'+
't2 none "T2"\n'+
't3 none "T3"\n'+
't4 none "T4"\n'+
't5 none "T5"\n'+
't6 none "T6"\n'+
't7 none "T7"\n'+
't8 none "T8"\n'+
't9 none "T9"\n'+
't10 none "T10"\n'+
't11 none "T11"\n'+
't12 none "T12"\n'+
't13 none "T13"\n'+
't14 none "T14"\n'+
't15 none "T15"\n'+
't16 none "T16"\n'+
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
'g6J xor_join "G6J"\n'+
'g7S or_split "G7S"\n'+
'g7J or_join "G7J"\n'+
'\n'+
'.sequences\n'+
'a1 sequenceflow "a1" e1 t1\n'+      
'a2 sequenceflow "a2" t1 g1J\n'+ 
'a3 sequenceflow "a3" e2 g1J\n'+ 
'a4 sequenceflow "a4" g1J t2\n'+
'a5 sequenceflow "a5" t2 g2S\n'+
'a6 sequenceflow "a6" g2S t3\n'+
'a7 sequenceflow "a7" t3 g3S\n'+
'a8 sequenceflow "a8" g3S t6\n'+
'a9 sequenceflow "a9" t6 g6S\n'+
'a10 sequenceflow "a10" g6S t7\n'+
'a11 sequenceflow "a11" g6S t8\n'+
'a12 sequenceflow "a12" t7 t15\n'+
'a13 sequenceflow "a13" t8 t16\n'+
'a15 sequenceflow "a15" t15 g6J\n'+
'a16 sequenceflow "a16" t16 g6J\n'+
'a14 sequenceflow "a14" g6J g3J\n'+
'a17 sequenceflow "a17" g3S t9\n'+
'a18 sequenceflow "a18" t9 g7S\n'+
'a19 sequenceflow "a19" g7S t10\n'+
'a20 sequenceflow "a20" g7S t11\n'+
'a21 sequenceflow "a21" t10 g7J\n'+
'a22 sequenceflow "a22" t11 g7J\n'+
'a23 sequenceflow "a23" g7J g3J\n'+
'a24 sequenceflow "a24" g2S g4S\n'+
'a25 sequenceflow "a25" g4S t4\n'+
'a26 sequenceflow "a26" t4 t12\n'+
'a27 sequenceflow "a27" t12 g4J\n'+
'a28 sequenceflow "a28" g4S t5\n'+
'a29 sequenceflow "a29" t5 g5S\n'+
'a30 sequenceflow "a30" g5S t13\n'+
'a31 sequenceflow "a31" g5S t14\n'+
'a32 sequenceflow "a32" t13 g5J\n'+
'a33 sequenceflow "a33" t14 g5J\n'+
'a34 sequenceflow "a34" g5J g4J\n'+
'a35 sequenceflow "a35" g3J g2J\n'+
'a36 sequenceflow "a36" g4J g2J\n'+
'a37 sequenceflow "a37" g2J e3';

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

        }
    }

    validateGraph(): void {
        if (this.result !== undefined) {
            this.graphIsValid = this.graphValidationService.isValid(this.result);
        }
    }
}
