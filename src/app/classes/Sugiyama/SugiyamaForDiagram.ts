import { Diagram } from "../diagram/diagram";
import { Connector } from "../diagram/elements/connector";
import { LayeredGraph } from "./LayeredGraph";
import { SimpleGraph } from "./SimpleGraph";
import { Sugiyama } from "./Sugiyama";
import { SugiyamaParser } from "./SugiyamaParser";

export function applySugiyama(diagram:Diagram){
    const input = new SimpleGraph()
    diagram.elements.forEach(el => {
        if(!(el instanceof Connector)){
            input.addNode(el.id)
        }
    });

    for (let el of diagram.elements) {
        if(el instanceof Connector) continue;
        for (let child of el.adjacentElements) {
            if(child instanceof Connector) continue;
            input.addArc(el.id, child.id)
            
         }
        
     }     

    const sugi = new Sugiyama(input)
    sugi.width = 1000
    sugi.height= 500
    sugi.padding = 50
    sugi.spacingXAxis = 200
    sugi.spacingYAxis= 200
    const result :LayeredGraph = sugi.getResult()
    SugiyamaParser.printGraph(input)
    SugiyamaParser.printLGraph(result)

    diagram.elements.forEach(el => {
      const node = result.getNode(el.id)
      if(node){
        el.x = node.x
        el.y = node.y
        console.log(`${el.id}  has position ${el.x}, ${el.y} order(${node.order})layer(${node.layer})`)

      }
    });
  }