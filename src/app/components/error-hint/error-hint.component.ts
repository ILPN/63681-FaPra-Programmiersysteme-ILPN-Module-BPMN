import {Component} from '@angular/core';
import {DisplayErrorService} from "../../services/display-error.service";
import {GraphValidationService} from "../../services/graph-validation.service";

@Component({
    selector: 'app-error-hint',
    templateUrl: './error-hint.component.html',
    styleUrls: ['./error-hint.component.scss']
})
export class ErrorHintComponent {
    errorVisible: boolean = false;
    msg: string = "";

    constructor(service: DisplayErrorService, private graphValidationService: GraphValidationService) {
        service.errorHint = this;
    }

    public showError(): void {
        this.errorVisible = true;
    }

    public removeMessage(): void {
        this.errorVisible = false;
        this.msg = '';
        this.graphValidationService.resetErrorMessage();
    }

    public setMessage(msg: string) {
        this.msg = msg;
        this.showError();
    }

}
