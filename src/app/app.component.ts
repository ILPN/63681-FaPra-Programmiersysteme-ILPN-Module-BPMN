import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ParserService } from './services/parser.service';
import { DisplayService } from './services/display.service';
import { debounceTime, Subscription } from 'rxjs';
import { applySugiyama } from './classes/Sugiyama/SugiyamaForDiagram';
import { SvgService } from './services/svg.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    public textareaFc: FormControl;

    selectedToggle: string ="Drag Free";
    toggleOptions: Array<String> = ["Drag Free", "Sugiyama Mode", "Switch Diagram"];
  
    selectionChanged(item : any) {
        console.log("Selected value: " + item.value);
    
        this.selectedToggle = item.value
    
        //this.setIsFreeMode();
      }

    private _sub: Subscription;

    constructor(
        private _parserService: ParserService,
        private _displayService: DisplayService
    ) {
        this.textareaFc = new FormControl();
        this._sub = this.textareaFc.valueChanges
            .pipe(debounceTime(400))
            .subscribe((val) => this.processSourceChange(val));
        this.textareaFc.setValue(`What s cookin, good lookin?`);
    }

    ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    private processSourceChange(newSource: string) {
        const result = this._parserService.parse(newSource);
        if (result !== undefined) {
            this._displayService.display(result);
        }
    }
}
