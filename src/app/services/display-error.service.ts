import {Injectable} from '@angular/core';
import {ErrorHintComponent} from "../components/error-hint/error-hint.component";

@Injectable({
    providedIn: 'root'
})
export class DisplayErrorService {
    errorHint: ErrorHintComponent | undefined;

    displayError(msg: string): void {
        if (this.errorHint !== undefined) {
            this.errorHint.setMessage(msg);
        }
    }

    addErrorMessage(message: string): void {
        this.errorHint?.addErrorMessage(message);
    }

}
