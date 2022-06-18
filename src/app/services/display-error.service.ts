import {Injectable} from '@angular/core';
import {ErrorHintComponent} from "../components/error-hint/error-hint.component";

@Injectable({
    providedIn: 'root'
})
export class DisplayErrorService {
    errorHint: ErrorHintComponent | undefined; // TODO: dieses undefined entfernen

    displayError(msg: string) {
        if (this.errorHint !== undefined) {
            this.errorHint.setMessage(msg);
        }
    }
}
