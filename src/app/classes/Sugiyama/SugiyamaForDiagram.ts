import { Diagram } from "../diagram/diagram";
import { Connector } from "../diagram/elements/connector";
import { EinPfeil } from "../diagram/elements/EinPfeil";
import { Gateway } from "../diagram/elements/gateway";
import { Task } from "../diagram/elements/task";
import { Event } from "../diagram/elements/event";

import { LayeredGraph, LNode } from "./LayeredGraph";
import { SimpleGraph } from "./SimpleGraph";
import { Sugiyama } from "./Sugiyama";
import { SugiyamaParser } from "./SugiyamaParser";

export function applySugiyama(diagram:Diagram, w = 1000, h =500 , p = 50){
    const input = new SimpleGraph()
    diagram.elements.forEach(el => {
        if((el instanceof Task || el instanceof Gateway|| el instanceof Event)){
            input.addNode(el.id)
        }
    });

    for (let el of diagram.elements) {
        if(!(el instanceof Task || el instanceof Gateway|| el instanceof Event)) continue;
        for (let child of el.adjacentElements) {
            if(child instanceof Connector){
                continue;
            }
            input.addArc(el.id, child.id)
         } 
     }     

    const sugi = new Sugiyama(input)
    sugi.width = w 
    sugi.height= h
    sugi.padding = p
    sugi.spacingXAxis = 200
    sugi.spacingYAxis= 200
    const result :LayeredGraph = sugi.getResult()
    SugiyamaParser.printGraph(input)
    SugiyamaParser.printLGraph(result)

    for (let node of result.getAllNoneDummyNodes()) {
        const el = diagram.elements.find(e => e.id == node.id)
        if (el == undefined) continue
        el.x = node.x
        el.y = node.y
        console.log(`${el.id}  has position ${el.x}, ${el.y} order(${node.order})layer(${node.layer})`)
     }

     const connectors:Connector[] = []
     for (let el of diagram.elements){
         if(el instanceof Connector) connectors.push(el)
     }
     //provisorisch
     for (let c of connectors){
         c.deleteAllPathConnectorElements()
         const fromLNode:LNode|undefined = result.getNode(c.start.id)
         const toLNode:LNode|undefined = result.getNode(c.end.id)
         if (fromLNode == undefined ||toLNode == undefined) continue;
         const levelSpan = toLNode.layer - fromLNode.layer
         if(levelSpan == 1 && (fromLNode.y != toLNode.y)){
             if(result.layers[fromLNode.layer].length< result.layers[toLNode.layer].length){
                c.addPathConnectorElement(fromLNode.x,toLNode.y)

             }else{
                c.addPathConnectorElement(toLNode.x,fromLNode.y)
             }
         }
         else{
            for (let i = 0; i < levelSpan; i++) {
            }
         }
     }

     const pfeile:EinPfeil[] = []
     for (let el of diagram.elements){
         if(el instanceof EinPfeil) pfeile.push(el)
     }
     for (let pfeil of pfeile){
        const fromLNode:LNode|undefined = result.getNode(pfeil.start.id)
        const toLNode:LNode|undefined = result.getNode(pfeil.end.id)
        if (fromLNode == undefined ||toLNode == undefined) continue;

        pfeil.setPfeilStart(fromLNode.x,fromLNode.y)
        pfeil.setPfeilZiel(toLNode.x,toLNode.y)
        pfeil.clearPfeilEcken()
        //making things square
        if(result.layers[fromLNode.layer].length >= result.layers[toLNode.layer].length){
            if(fromLNode.y != toLNode.y){ 
            pfeil.addPfeilEcke(toLNode.x,fromLNode.y)
            }
        }else{
            if(fromLNode.y != toLNode.y){ 
                pfeil.addPfeilEcke(fromLNode.x,toLNode.y)
                } 
        } 
    }
  }