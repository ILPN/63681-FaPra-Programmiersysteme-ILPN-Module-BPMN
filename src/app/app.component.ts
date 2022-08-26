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
    private _subValueChange: Subscription;
    private _subDragging: Subscription;
    private _subError: Subscription;
    private result: any;
    textareaError: string | undefined;
    graphIsValid: boolean = false;

    constructor(
        private _displayService: DisplayService,
        private _parserService: ParserService,
        private graphValidationService: GraphValidationService
    ) {
        this.textareaFc = new FormControl();
        this._subValueChange = this.textareaFc.valueChanges
            .pipe(debounceTime(1000))
            .subscribe((val) => this.processSourceChange(val));
        this._subDragging = this._parserService.positionChange.
            pipe(debounceTime(400)).
            subscribe((val) => this.textareaFc.setValue(val));
        this._subError = this._parserService.textareaError.pipe(debounceTime(400))
            .subscribe((val) => this.textareaError = val);
        // this.textareaFc.setValue(`Your advertising could be here`);



        let s: String = '.events\n' +
            'e1 start "Vorzeitige Abgabe"\n' +
            'e2 start "Zeit abgelaufen"\n' +
            'e3 intermediate\n' +
            'e4 end\n' +
            '\n' +
            '.tasks\n' +
            't1 manual "Einreichen"\n' +
            't2 usertask "Applaus"\n' +
            't3 sending "Daumen runter"\n' +
            't4 sending "Untersuchen"\n' +
            't5 receiving "Information erhalten"\n' +
            't6 businessrule "Benoten"\n' +
            't7 service ""\n' +
            '\n' +
            '.gateways\n' +
            'g1J xor_join ""\n' +
            'g2S or_split "gefällt es?"\n' +
            'g2J or_join \n' +
            'g3S and_split "G2S"\n' +
            'g3J and_join "G3J"\n' +
            'g4S xor_split "G4S"\n' +
            'g4J xor_join "G4J"\n' +
            '\n' +
            '.edges\n' +
            'e1 t1 sequenceflow\n' +
            't1 g1J association\n' +
            'e2 g1J association\n' +
            'g1J e3 sequenceflow\n' +
            'e3 g2S sequenceflow\n' +
            'g2S t2 sequenceflow "ja"\n' +
            'g2S g2J defaultflow "vielleicht"\n' +
            'g2S t3 sequenceflow "nein"\n' +
            't2 g2J sequenceflow\n' +
            't3 g2J sequenceflow\n' +
            'g2J g3S sequenceflow\n' +
            'g3S t4 sequenceflow\n' +
            'g3S t5 sequenceflow\n' +
            't4 g3J sequenceflow\n' +
            't5 g3J sequenceflow\n' +
            'g3J t6 informationflow\n' +
            't6 g4S sequenceflow\n' +
            'g4S t7 sequenceflow\n' +
            't7 g4J sequenceflow\n' +
            'g4J e4 sequenceflow\n' +
            'g4S g4J sequenceflow';

        console.log(s);
        this.textareaFc.setValue(s);
    }


    ngOnDestroy(): void {
        this._subValueChange.unsubscribe();
        this._subDragging.unsubscribe();
        this._subError.unsubscribe();
    }

    private processSourceChange(newSource: string) {
        this.textareaError = "";

        this.graphIsValid = false
        this.result = this._parserService.parse(newSource);
        if (this.result) {

            if (this.result.nodes.length === 0)
                this.result = BpmnGraph.anotherMonsterGraph();
            this._displayService.display(this.result);
            this._parserService.afterSugiyamaLayout(this.result, newSource);
        }
    }

    validateGraph(): void {
        if (this.result !== undefined) {
            this.graphIsValid = this.graphValidationService.isValid(this.result);
        }
    }


}