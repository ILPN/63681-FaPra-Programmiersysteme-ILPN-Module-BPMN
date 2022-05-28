import { Diagram } from "../diagram/diagram";
import { LayeredGraph } from "./LayeredGraph";
import { SimpleArc, SimpleGraph } from "./SimpleGraph";
import { Sugiyama } from "./Sugiyama";

export class SugiyamaParser { 

  static strToSimpleGraph(str: string): SimpleGraph {
    const g = new SimpleGraph()
    str = str.trim()
    const nodesAndArcs = str.split("--")
    nodesAndArcs[0] = nodesAndArcs[0].trim()
    nodesAndArcs[1] = nodesAndArcs[1].trim()
    nodesAndArcs[0].split(/\r?\n/).forEach((e) => {
      g.addNode(e.trim())
    })
    nodesAndArcs[1].split(/\r?\n/).forEach((e) => {
      const fromTo = e.trim().split(" ")
      g.addArc(fromTo[0],fromTo[1])
    })
    return g
  }

  static printGraph(g:SimpleGraph){
    console.log("---------------")
    g.nodes.forEach(s => {
        console.log(s.id)
    });
    g.arcs.forEach(s => {
        console.log(s.from +" "+s.to)
    });
    console.log("---------------")
  }

  static printLGraph(g:LayeredGraph){
    console.log("layered---------")
    g.getAllNodes().forEach(s => {
        console.log(s.id)
    });
    g.arcs.forEach(s => {
        console.log(s.from.id +" "+s.to.id)
    });
    console.log("---------------")
  }
}
