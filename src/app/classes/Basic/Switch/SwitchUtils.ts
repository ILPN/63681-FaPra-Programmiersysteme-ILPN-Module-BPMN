import { SwitchableNode } from "./SwitchableNode";

export class SwitchUtils{


      /** Diese Methode fügt die übergebenen Elemente dem Arry hinzu, dies jedoch nur wenn das Element noch nicht im Array enthalten ist. 
     * @param array das Array in das das Element aufgenommen werden soll.
     * @param element das Element das hinzugefügt werden soll.
    */
       public static addNodesToArray(newNodes: SwitchableNode[], existingNodes: SwitchableNode[]): SwitchableNode[] {
        for (let node of newNodes)
            this.addNodeToArray(node, existingNodes);
        return existingNodes;
    }


    public static addNodeToArray(newNode: SwitchableNode, existingNodes: SwitchableNode[]): SwitchableNode[] {
        
            if (!existingNodes.includes(newNode)) existingNodes.push(newNode);

            return existingNodes
    }
}