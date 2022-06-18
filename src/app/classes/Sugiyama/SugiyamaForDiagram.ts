import { LayeredGraph, LNode } from "./LayeredGraph";
import { SimpleGraph } from "./SimpleGraph";
import { Sugiyama } from "./Sugiyama";
import { BpmnGraph } from "../Basic/Bpmn/BpmnGraph";

export function applySugiyama(diagram:BpmnGraph, w = 1000, h =500 , p = 50){
    const input = new SimpleGraph()
    for (const node of diagram.nodes) {
        input.addNode(node.id)
    }
    for (const edge of diagram.edges) {
        input.addArc(edge.fromId,edge.toId)
    }

    const sugi = new Sugiyama(input)
    sugi.width = w 
    sugi.height= h
    sugi.padding = p
    sugi.spacingXAxis = 200
    sugi.spacingYAxis= 200
    const result :LayeredGraph = sugi.getResult()

    for (let node of result.getAllNoneDummyNodes()) {
        const el = diagram.nodes.find(e => e.id == node.id)
        if (el == undefined) continue
        el.x = node.x
        el.y = node.y
     }
   
     for (const edge of diagram.edges) {
        const fromLNode:LNode = result.getNode(edge.fromId)!
        const toLNode:LNode = result.getNode(edge.toId)!

        edge.setStartPos(fromLNode.x,fromLNode.y)
        edge.setEndPos(toLNode.x,toLNode.y)
        edge.clearCorners()
        //const dummys = result.getSortedDummysForEdge(arrow.start.id,arrow.end.id)
       // for (const dN of dummys) {
         //   arrow.addDummyNodeCorner(dN.id,dN.x,dN.y)
       // }
        //making things square
        
        if(result.layers[fromLNode.layer].length >= result.layers[toLNode.layer].length){
            if(fromLNode.y != toLNode.y){ 
            edge.addCornerXY(toLNode.x,fromLNode.y)
            }
        }else{
            if(fromLNode.y != toLNode.y){ 
               edge.addCornerXY(fromLNode.x,toLNode.y)
                } 
        }    
        
     }
  }