import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ParserService } from './services/parser.service';
import { DisplayService } from './services/display.service';
import { debounceTime, Subscription } from 'rxjs';
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
    private _sub1: Subscription;
    private result: any; //todo: any  muss weg

    constructor(
        private _parserService: ParserService,
        private _displayService: DisplayService,
        private graphValidationService: GraphValidationService
    ) {
        this.textareaFc = new FormControl();
        this._sub = this.textareaFc.valueChanges
            .pipe(debounceTime(400))
            .subscribe((val) => this.processSourceChange(val));
        this._sub1 = this._parserService.positionChange.
            pipe(debounceTime(400)).
            subscribe((val) => this.textareaFc.setValue(val));
        this.textareaFc.setValue(`Your advertising could be here`);
    }

    ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    private processSourceChange(newSource: string) {
        this.result = this._parserService.parse(newSource);
        if (this.result) {

            if (this.result.nodes.length === 0)
                this.result = BpmnGraph.sampleGraph()

            this._displayService.display(this.result);

        }
    }

    validateGraph(): void {
        if (this.result)
            this.graphValidationService.validateGraph(this.result);
    }
}
