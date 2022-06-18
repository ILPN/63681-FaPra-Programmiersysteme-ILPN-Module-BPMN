import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DisplayErrorService} from "../../services/display-error.service";

@Component({
    selector: 'input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {

    @Input() buttonText: string | undefined;
    @Input() buttonIcon: string | undefined;

    @Output() newInputEvent = new EventEmitter<string>();

    constructor(private displayErrorService: DisplayErrorService) {
    }

    onFileDragged(e: DragEvent) {
        if (e.dataTransfer) {
            let list: FileList = e.dataTransfer.files;
            let file: File = list[0];
            this.fileUpload(file);
        }
    }

    onFileSelected(e: Event) {
        let list = (e.target as HTMLInputElement).files;
        console.log('file selected');

        if (list) {
            const file: File = list[0];
            this.fileUpload(file);
        }
    }

    fileUpload(file: File) {
        console.log('uploading file');
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener('load', () => {
            if (reader.result) {
                const input = reader.result.toString();
                const validated = this.validateFormat(input);
                if (validated) {
                    console.log("validation successful");
                    this.newInputEvent.emit(input);
                }

            }
        })
    }

    validateFormat(input: string): boolean {
        console.log(input);
        if (!input.includes(".activities" && ".sequences")) {
            this.displayErrorService.displayError("wrong format");
            console.log("wrong format");
            return false;
        } else {
            if (!this.validateCategory("activities", input)) {
                return false;
            }
            if (!this.validateCategory("sequences", input)) {
                return false;
            }
            ;

            if (input.includes(".events")) {
                if (!this.validateCategory("events", input)) {
                    return false;
                }
            }
            if (input.includes(".gateways")) {
                if (!this.validateCategory("gateways", input)) {
                    return false;
                }
            }


        }
        return true;
    }

    validateCategory(category: string, input: string): boolean {
        let regexp: RegExp;
        switch (category) {
            //bei Aktivitäten und Events müssen wir uns noch auf Typen einigen
            //die für die Eingabe gültig sind, dann kann ich sie hier mit überprüfen
            //aktuell sind nur die Typen für Gateways eindeutig definiert

            case "activities":
                regexp = /^[\w]+ [\w]+ "[\w]+"(?: \([0-9]*,[0-9]*\))?/;
                break;
            case "sequences":
                regexp = /^[\w]+ [\w]+ "[\w]+"(?: \([0-9]*,[0-9]*\))?/;
                break;
            case "events":
                regexp = /^[\w]+ [\w]+ "[\w]+"(?: \([0-9]*,[0-9]*\))?/;
                break;
            case "gateways":
                regexp = /^[\w]+ (and|or|xor)+(?: \([0-9]*,[0-9]*\))?/;
                break;
            default:
                return false;
        }
        console.log("validating category:" + category);
        let substring = input.substring(input.indexOf("." + category));
        let nextLine = substring.search(/\n/) + 1;
        substring = substring.substring(nextLine);
        nextLine = 0;
        while (substring.charAt(nextLine) !== "." && substring.charAt(nextLine) !== " " && substring.search(/\n/) !== 1) {
            const match = substring.match(regexp);
            if (match === null) {
                console.log("format error at " + category);
                this.displayErrorService.displayError("format error at " + category);
                return false;
            }
            console.log("regexp matched:" + match);
            nextLine = substring.search(/\n/) + 1;
            substring = substring.substring(nextLine);
            if (nextLine === 0) {
                substring = " ";
                //wenn das Ende der Datei erreicht ist, wird aus der while-Schleife ausgetreten
            }
            nextLine = 0;
            console.log(substring.charAt(nextLine));
        }
        console.log(category + " validated");
        return true;
    }

}
