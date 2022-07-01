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

            case "activities": regexp = /^[\w]+ (Sending|Manual|Service|BusinessRule|Receiving|UserTask) "[\w ]*"(?: \([0-9]*,[0-9]*\))?/i; break;
            case "sequences": regexp = /^[\w]+ (SequenceFlow|Association|InformationFlow) "[\w ]*" [\w]+ [\w]+(?: \([0-9]*,[0-9]*\))?/i; break;
            case "events": regexp = /^[\w]+ (Start|End|Intermediate) "[\w ]*"(?: \([0-9]*,[0-9]*\))?/i; break;
            case "gateways": regexp = /^[\w]+ (XOR_SPLIT|XOR_JOIN|AND_SPLIT|AND_JOIN|OR_SPLIT|OR_JOIN)(?: \([0-9]*,[0-9]*\))?/i; break;
            default: return false;
        }

        console.log("validating category:" + category);
        const lines = input.split('\n');
        let substring = input.substring(input.indexOf("." + category));
        let pos;
        let cat = lines.find(el => el.startsWith("." + category));
        if(!cat) {
            console.log("error: no" + category);
        } else {
            pos = lines.indexOf(cat)+1;
            while(pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let match = lines[pos].match(regexp); 
                if (match === null) {
                    console.log("format error at " + category);
                    this.displayErrorService.displayError("format error at " + category);
                    return false;
                }
                console.log("regexp matched:" + match);
                pos++;
            }
        }
        console.log(category + " validated");
        return true;
        }
    
    }
