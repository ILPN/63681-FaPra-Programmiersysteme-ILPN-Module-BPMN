import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DisplayErrorService} from "../../services/display-error.service";
import { FormValidationService } from 'src/app/services/form-validation.service';

@Component({
    selector: 'input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {

    @Input() buttonText: string | undefined;
    @Input() buttonIcon: string | undefined;

    @Output() newInputEvent = new EventEmitter<string>();

    constructor(private displayErrorService: DisplayErrorService,
        private formValidationService:FormValidationService) {
    }

    onFileDragged(e: DragEvent) {
        console.log('e');
        console.log(e);
        console.log('e.dataTransfer');
        console.log(e.dataTransfer);
        if (e.dataTransfer) {
            let list: FileList = e.dataTransfer.files;
            let file: File = list[0];
            this.fileUpload(file);
        }
    }

    onFileSelected(e: Event) {
        let list = (e.target as HTMLInputElement).files;
        // console.log('file selected');

        if (list) {
            const file: File = list[0];
            this.fileUpload(file);
        }
    }

    fileUpload(file: File) {
        // console.log('uploading file');
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener('load', () => {
            if (reader.result) {
                const input = reader.result.toString();
                const validated = this.formValidationService.validateFormat(input);
                if (validated) {
                    // console.log("validation successful");
                    this.newInputEvent.emit(input);
                }

            }
        })
    }

}
