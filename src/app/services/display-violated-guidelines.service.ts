import {Injectable} from '@angular/core';
import {ViolatedGuidelinesComponent} from "../components/violated-guidelines/violated-guidelines.component";

@Injectable({
    providedIn: 'root'
})
export class DisplayViolatedGuidelinesService {
    violatedGuidelinesComponent: ViolatedGuidelinesComponent | undefined;

    displayViolatedGuidelines(violatedGuidelines: string[]): void {
        this.violatedGuidelinesComponent?.setViolatedGuidelines(violatedGuidelines);
    }

    resetViolatedGuidelines() {
        this.violatedGuidelinesComponent?.setViolatedGuidelines([]);
    }
}
