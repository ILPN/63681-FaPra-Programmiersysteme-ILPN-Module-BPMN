import { DisplayErrorService } from "./display-error.service";
import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class FormValidationService {

    constructor(private displayErrorService: DisplayErrorService){

    }

    validateFormat(input: string): boolean {
        console.log(input);
        if (!input.includes(".activities" && ".sequences")) {
            this.displayErrorService.displayError("wrong format");
            //console.log("wrong format");
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

    private validateCategory(category: string, input: string): boolean {
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
            this.displayErrorService.displayError("error: no" + category);
            //console.log("error: no" + category);
        } else {
            pos = lines.indexOf(cat)+1;
            while(pos < lines.length && lines[pos].match(/^\w/) !== null) {
                let match = lines[pos].match(regexp); 
                if (match === null) {
                    //console.log("format error at " + category);
                    this.displayErrorService.displayError("format error at " + category);
                    return false;
                }
                //console.log("regexp matched:" + match);
                pos++;
            }
        }
        //console.log(category + " validated");
        return true;
        }
    
    }