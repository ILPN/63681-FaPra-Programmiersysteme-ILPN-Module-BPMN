import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayErrorService } from "../../services/display-error.service";
import { FormValidationService } from 'src/app/services/form-validation.service';
import { XmlExporter } from 'src/app/classes/XmlExport/xml-export';
import { ParserService } from 'src/app/services/parser.service';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { BpmnEventStart } from 'src/app/classes/Basic/Bpmn/events/BpmnEventStart';
import { DisplayService } from 'src/app/services/display.service';
import { Validator } from 'src/app/classes/Basic/Bpmn/BpmnGraphValidator';

@Component({
    selector: 'output-field',
    templateUrl: './output-field.component.html',
    styleUrls: ['./output-field.component.scss']
})
export class OutputFieldComponent {

    @Input() buttonText: string | undefined;
    @Input() buttonIcon: string | undefined;
    @Input() text: string | undefined;

    private NO_GRAPH_ERR = "Kein BPMN Graph!"
    private SOMETHING_WENT_WRONG = "Etwas schief gelaufen bei Konvertierung"

    constructor(private displayErrorService: DisplayErrorService,
        private formValidationService: FormValidationService,
        private parser: ParserService,
        private displayService: DisplayService) {
    }

    showMenu() {
        document.getElementById("myDropdown")?.classList.toggle("show");
    }

    download(type: string) {
        let textToExport = this.text;
        let filetype = '.txt';
        switch (type) {
            case 'bpmn': {
                if (textToExport) {
                    if (!this.formValidationService.validateFormat(textToExport)) {
                        this.displayErrorService.displayError("BPMN-Format ist verletzt; nicht exportierbar");
                        return;
                    }

                };
                break;
            }
            case 'bpmn-xml': {
                filetype = ".bpmn";

                //error message and abort if invalid graph
                let graph = this.validate()
                if (!graph)
                    return

                //valid graph
                textToExport = XmlExporter.exportBpmnAsXml(graph);
                if (!textToExport) {
                    this.displayErrorService.displayError(this.SOMETHING_WENT_WRONG)
                    return
                }

                break;
            }

            case 'pn':
                this.displayErrorService.displayError("PN-Format wird noch implementiert");
                //todo: textToExport zu PN-Format konvertieren; return entfernen
                return;
                break;
        }


        let a = document.getElementById(type);
        if (a && textToExport) {
            a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToExport));
            a.setAttribute('download', type + filetype);
        }
    }

    private validate(): BpmnGraph | null {
        let graph = this.displayService.diagram;
        //no graph
        if (!graph) {
            this.displayErrorService.displayError(this.NO_GRAPH_ERR)
            return null
        }

        //invalid
        let validationResult = new Validator(graph.nodes).validateGraph()
        if (!validationResult.valid) {
            this.displayErrorService.displayError(validationResult.errors)
            return null
        }

        return graph
    }

}