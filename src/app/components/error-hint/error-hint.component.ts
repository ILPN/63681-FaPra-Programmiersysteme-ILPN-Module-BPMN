import {Component} from '@angular/core';

@Component({
    selector: 'app-error-hint',
    templateUrl: './error-hint.component.html',
    styleUrls: ['./error-hint.component.scss']
})
export class ErrorHintComponent {
    errorVisible: boolean = false;

    public showError(): void {
        this.errorVisible = true;
    }

    public removeMessage(): void {
        this.errorVisible = false;
    }

}
