import { LayeredGraph } from "./LayeredGraph";
import { SimpleGraph } from "./SimpleGraph";
import { Sugiyama } from "./Sugiyama";
import { SugiyamaParser } from "./SugiyamaParser";



export function sugiyamaTest(){
    const gstring = 
    `
    1
    2
    3
    4
    --
    1 2
    2 4
    4 3
    3 2
    
    `
    //const graph = MyParser.strToSimpleGraph(gstring)
    
    // this is how Sugiyama can be used
    //------------------
    const graph = new SimpleGraph()
    graph.addNode("1")
    graph.addNode("2")
    graph.addNode("3")
    graph.addNode("4")
    graph.addArc("1", "2")
    graph.addArc("2", "3")
    graph.addArc("3", "4")
    graph.addArc("4", "2")
    
    const sugi = new Sugiyama(graph)
    sugi.width = 1000
    sugi.height= 500
    sugi.padding = 50
    sugi.spacingXAxis = 40
    sugi.spacingYAxis= 20
    const result :LayeredGraph = sugi.getResult()
    SugiyamaParser.printGraph(graph)
    SugiyamaParser.printLGraph(result)
    
    console.log("-----------------")
    result.getAllNodes().forEach(n => {
        console.log(`id: ${n.id} layer:${n.layer} order:${n.order} x,y:(${n.x},${n.y})`)
    });
    //---------------------
}