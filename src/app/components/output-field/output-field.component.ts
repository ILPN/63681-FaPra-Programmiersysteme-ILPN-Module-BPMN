import { Component, Input } from '@angular/core';
import { BpmnGraph } from 'src/app/classes/Basic/Bpmn/BpmnGraph';
import { Validator } from 'src/app/classes/Basic/Bpmn/BpmnGraphValidator';
import { Petrinet } from 'src/app/classes/Petrinet/petrinet';
import { XmlExporter } from 'src/app/classes/XmlExport/xml-export';
import { DisplayService } from 'src/app/services/display.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { DisplayErrorService } from "../../services/display-error.service";

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
    private SOMETHING_WENT_WRONG = "Problem bei Konvertierung: "

    constructor(private displayErrorService: DisplayErrorService,
        private formValidationService: FormValidationService,
        private displayService: DisplayService) {
    }

    showMenu() {
        document.getElementById("myDropdown")?.classList.toggle("show");
    }

    download(type: string) {
        this.resetButton(type)
        let textToExport = null;
        let filetype = '.txt';
        switch (type) {
            case 'bpmn': {
                
                let diagram = this.displayService.diagram;
                if (this.text) {
                    let outputText = this.addCoordinates(diagram);

                    if (!this.formValidationService.validateFormat(outputText)) {
                        this.displayErrorService.displayError("BPMN-Textformat ist verletzt; nicht exportierbar");
                        return;
                    }
                    textToExport = outputText;
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
                let result = XmlExporter.exportBpmnAsXml(graph);
                if (!result.ok) {
                    this.displayErrorService.displayError(this.SOMETHING_WENT_WRONG + result.error)
                    return
                }

                textToExport = result.xmlText

                break;
            }

            case 'pn': {

                //error message and abort if invalid graph
                let graph = this.validate()
                if (!graph)
                    return

                //valid graph
                let result = new Petrinet(graph.nodes).print();
                if (!result.valid) {
                    this.displayErrorService.displayError(this.SOMETHING_WENT_WRONG + ": " + result.errors)
                    return
                }
                textToExport = result.pnText
                break;
            }
        }


        let a = document.getElementById(type);
        if (a && textToExport) {
            a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToExport));
            a.setAttribute('download', type + filetype);

        }



    }
    private resetButton(type: string) {
        let a = document.getElementById(type);
        if (a) {
            if (a.getAttribute('href'))
                a.removeAttribute('href')

            if (a.getAttribute('download'))
                a.removeAttribute('download');
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

    private addCoordinates(diagram: BpmnGraph): string {

        let text = this.text?.split("\n");
        
        for (const node of diagram.nodes) {
            if(text) {
                let newCoordString = "(" + node.getPos().x + "," + node.getPos().y + ")";
                let matchLine = text.find(line => line.startsWith(node.id));
                if(matchLine != undefined) {
                    let index = text.indexOf(matchLine);
                    let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString);
                  
                    if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                        matchLineNew = matchLine.concat(" "+newCoordString);
                    }
                   
                    text[index] = matchLineNew;
                
            }}
        }
            for (const edge of diagram.edges){
                if(text) {
                let newCoordString1 = "(" + edge.from.x + "," + edge.from.y + ")";
                let newCoordString2 = "(" + edge.to.x + "," + edge.to.y + ")";
                let matchLine = text.find(line => line.startsWith(edge.id));

                if(matchLine != undefined) {
                    let index = text.indexOf(matchLine);

                    let matchLineNew = matchLine.replace(/\(-?[0-9]*,-?[0-9]*\)/,newCoordString1 + " " + newCoordString2);
                    if(matchLine.match(/\(-?[0-9]*,-?[0-9]*\)/) === null) {
                        matchLineNew = matchLine.concat(" "+newCoordString1 + " " + newCoordString2);
                    }
                    text[index] = matchLineNew;
            }}

        }
        if(text) {
            return text.join("\n");
        }else return "";
}}
