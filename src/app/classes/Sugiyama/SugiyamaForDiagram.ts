import { Diagram } from "../diagram/diagram";
import { Arrow } from "../diagram/elements/arrow/Arrow";
import { Gateway } from "../diagram/elements/gateway";
import { Task } from "../diagram/elements/task";
import { Event } from "../diagram/elements/event";

import { LayeredGraph, LNode } from "./LayeredGraph";
import { SimpleGraph } from "./SimpleGraph";
import { Sugiyama } from "./Sugiyama";
import { DragDiagram } from "../diagram/DragDiagram";
import { DummyNodeCorner } from "../diagram/elements/arrow/DummyNodeCorner";

export function applySugiyama(diagram:DragDiagram, w = 1000, h =500 , p = 50){
    const input = new SimpleGraph()
    diagram.getElems().forEach(el => {
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
        const el = diagram.getElems().find(e => e.id == node.id)
        if (el == undefined) continue
        el.x = node.x
        el.y = node.y
     }
     

     const arrows:Arrow[] = []
     for (let el of diagram.getElems()){
         if(el instanceof Arrow) arrows.push(el)
     }

     for (let arrow of arrows){
        const fromLNode:LNode|undefined = result.getNode(arrow.start.id)
        const toLNode:LNode|undefined = result.getNode(arrow.end.id)
        if (fromLNode == undefined ||toLNode == undefined) continue;

        arrow.setArrowStartPos(fromLNode.x,fromLNode.y)
        arrow.setArrowTargetPos(toLNode.x,toLNode.y)
        arrow.clearArrowCorners()
        const dummys = result.getSortedDummysForEdge(arrow.start.id,arrow.end.id)
        for (const dN of dummys) {
            arrow.addDummyNodeCorner(dN.id,dN.x,dN.y)
        }
        //making things square
        /*
        if(result.layers[fromLNode.layer].length >= result.layers[toLNode.layer].length){
            if(fromLNode.y != toLNode.y){ 
            arrow.addArrowCornerXY(toLNode.x,fromLNode.y)
            }
        }else{
            if(fromLNode.y != toLNode.y){ 
               arrow.addArrowCornerXY(fromLNode.x,toLNode.y)
                } 
        }    */
    }
    diagram.setSugiyamaResult(result)
  }