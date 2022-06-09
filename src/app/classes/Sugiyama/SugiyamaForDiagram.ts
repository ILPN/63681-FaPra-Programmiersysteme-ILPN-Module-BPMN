import { Diagram } from "../diagram/diagram";
import { Connector } from "../diagram/elements/connector";
import { Arrow } from "../diagram/elements/Arrow";
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
        if (el instanceof Arrow){
            const a = el as Arrow
            input.addArc(a.start.id,a.end.id)
        }
    });

    const sugi = new Sugiyama(input)
    sugi.width = w 
    sugi.height= h
    sugi.padding = p
    sugi.spacingXAxis = 200
    sugi.spacingYAxis= 200
    const result :LayeredGraph = sugi.getResult()

    for (let node of result.getAllNoneDummyNodes()) {
        const el = diagram.elements.find(e => e.id == node.id)
        if (el == undefined) continue
        el.x = node.x
        el.y = node.y
     }
     

     const pfeile:Arrow[] = []
     for (let el of diagram.elements){
         if(el instanceof Arrow) pfeile.push(el)
     }
     for (let pfeil of pfeile){
        const fromLNode:LNode|undefined = result.getNode(pfeil.start.id)
        const toLNode:LNode|undefined = result.getNode(pfeil.end.id)
        if (fromLNode == undefined ||toLNode == undefined) continue;

        pfeil.setArrowStart(fromLNode.x,fromLNode.y)
        pfeil.setArrowTarget(toLNode.x,toLNode.y)
        pfeil.clearArrowCorners()
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
    for (const pfeil of pfeile) {
        for (const ecke of pfeil.corners) {
            diagram.addElement(ecke)
        } 
    }

    //no dummys yet
    
  }