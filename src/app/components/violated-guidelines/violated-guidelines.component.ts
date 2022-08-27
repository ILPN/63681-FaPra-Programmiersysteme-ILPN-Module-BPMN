import {Component} from '@angular/core';
import {DisplayViolatedGuidelinesService} from "../../services/display-violated-guidelines.service";

@Component({
    selector: 'app-violated-guidelines',
    templateUrl: './violated-guidelines.component.html',
    styleUrls: ['./violated-guidelines.component.scss']
})
export class ViolatedGuidelinesComponent {

    violatedGuidelines: string[] = [];

    constructor(service: DisplayViolatedGuidelinesService) {
        service.violatedGuidelinesComponent = this;
    }

    setViolatedGuidelines(violatedGuidelines: string[]) {
        this.violatedGuidelines = violatedGuidelines;
        this.violatedGuidelinesVisible();
    }

    violatedGuidelinesVisible(): boolean {
        return this.violatedGuidelines.length > 0;
    }

}
