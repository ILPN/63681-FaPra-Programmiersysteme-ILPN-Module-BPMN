import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DisplayErrorService} from "../../services/display-error.service";
import { FormValidationService } from 'src/app/services/form-validation.service';

@Component({
    selector: 'output-field',
    templateUrl: './output-field.component.html',
    styleUrls: ['./output-field.component.scss']
})
export class OutputFieldComponent {

    @Input() buttonText: string | undefined;
    @Input() buttonIcon: string | undefined;
    @Input() text: string | undefined;

    constructor(private displayErrorService: DisplayErrorService, 
            private formValidationService: FormValidationService) {
    }

    showMenu() {
        document.getElementById("myDropdown")?.classList.toggle("show");
    }

    download(type:string) {
        let textToExport = this.text;
        let filetype = '.txt';
        if(type === 'bpmn' && textToExport) {
            if(!this.formValidationService.validateFormat(textToExport)){
                this.displayErrorService.displayError("BPMN-Format ist verletzt; nicht exportierbar");
                return;
            }
        }
        if(type === "bpmn-xml") {
            filetype = ".xml";
        }
        
        //ist der type pn oder bpmn-xml, wird textToExport zu dem jeweiligen Format geändert 

        let a = document.getElementById(type);
            if(a && textToExport) {
                a.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(textToExport));
                a.setAttribute('download', type + filetype);
            }
            }
    }