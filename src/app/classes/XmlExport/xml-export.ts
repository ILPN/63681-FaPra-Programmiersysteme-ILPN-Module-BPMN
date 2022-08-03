export class XmlExporter {

    static generateXml(text: string | undefined): string | undefined {
        if (!text) 
            return undefined;
        


        //valid diagram
        const header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"

        //namespaces
        var doc = document.implementation.createDocument("", "", null);
        const bpmn = "http://www.omg.org/spec/BPMN/20100524/MODEL";
        const xsi = "http://www.w3.org/2001/XMLSchema-instance";
        const bpmndi = "http://www.omg.org/spec/BPMN/20100524/DI"
        const dc = "http://www.omg.org/spec/DD/20100524/DC"
        const di = "http://www.omg.org/spec/DD/20100524/DI"
        const id = "Definitions_1xujjh5"
        const target_ns = "http://bpmn.io/schema/bpmn"
        
        //root element definitions
        const definitions = doc.createElementNS(bpmn, "bpmn:definitions");
        definitions.setAttribute("xmlns:xsi", xsi)
        definitions.setAttribute("xmlns:bpmndi", bpmndi)
        definitions.setAttribute("xmlns:dc", dc)
        definitions.setAttribute("xmlns:di", di)
        definitions.setAttribute("id", id)
        definitions.setAttribute("targetNamespace", target_ns)
        doc.appendChild(definitions)

        //process
        var process = doc.createElementNS(bpmn, "bpmn:process")
        process.setAttribute("id", "uniqueProcess")
        definitions.appendChild(process);

        //startEvent
        var startEvent = doc.createElementNS(bpmn, "bpmn:startEvent")
        startEvent.setAttribute("id", "uniqueStart")
        process.appendChild(startEvent);

        //to string
        var serializer = new XMLSerializer();
        var xmlString = serializer.serializeToString(doc);

        return header + xmlString
    }
}