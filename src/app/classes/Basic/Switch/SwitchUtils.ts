import { ClassicSwitch } from "./classic-switch";
import { SwitchController } from "./switch-controller";
import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchableNode } from "./SwitchableNode";
import { SwitchState } from "./switchstatetype";

export class SwitchUtils {


    /**
     * adds items from source array to target array, only if the items don't exist in the target
     * @param newItems items to be added
     * @param existingItems target array
     * @returns
     */
    public static addItems<T>(newItems: T[], existingItems: T[]): T[] {
        for (let node of newItems)
            this.addItem(node, existingItems);
        return existingItems;
    }

    /**
     * adds an item to the array if it does not exist in this array
     * @param newItem
     * @param existingItems
     * @returns
     */
    public static addItem<T>(newItem: T, existingItems: T[]): T[] {

        if (!existingItems.includes(newItem)) existingItems.push(newItem);

        return existingItems
    }

    /**
     * checks if the node is a gateway
     * @param node
     * @returns
     */
    public static isGateway(node: SwitchableNode): boolean {
        return node instanceof SwitchableGateway
    }

    /**
     * checks if the node is a gateway
     * @param node
     * @returns
     */
    public static isNoNodeEnabledOrSwitched(nodeArray: SwitchableNode[]): boolean {
        let answer = true;
        nodeArray.forEach(element => {
            if (element.switchState === SwitchState.enabled || element.switchState === SwitchState.switched) answer = false;
        });
        return answer
    }
 
        /**
     * checks if the node is a gateway
     * @param node
     * @returns
     */
         public static isNoNodeUnequalDisabled(nodeArray: SwitchableNode[]) : boolean {
            let answer = true;
            nodeArray.forEach(element => {
                if (element.switchState !== SwitchState.disabled) answer = false;
            });
            return answer
        }

    /**
     * This recursive method create a Array of SwitchableNode where inside all SwitchableNode the are between startNode and endNode. At the beginning the array must be empty. This method searches backward.
     * @param startNode Start Node
     * @param endNode End Node
     * @param array Array must be [] when called, it is needed for recursion
     * @return returns a array with nodes which are located between startNode and endNode
     */
    public static getAllElementsBetweenNodeToNodeBackward(startNode: SwitchableNode, endNode: SwitchableNode, array: SwitchableNode[]): SwitchableNode[] {
        if (startNode !== endNode) {
            SwitchUtils.addItem(startNode, array);
            startNode.predecessors.forEach(predecessor => {
                this.getAllElementsBetweenNodeToNodeBackward(predecessor, endNode, array);
            });
        }
        return array;
    }

    /** Return true, if the SwitchController is instanceof ClassicSwitch
     * @param controller SwitchController
     * @return Return true, if the SwitchController is instanceof ClassicSwitch 
     */
     public static isClassicSwitch(controller: SwitchController): boolean {
         return controller instanceof ClassicSwitch;
     }
    
    // Only for debugging
    // public static printAllElements(startNode: SwitchableNode, endNode: SwitchableNode, array: SwitchableNode[]): void {
    //     let s: String = "";
    //     array.forEach(element => {
    //         s += element.id + "=> "
    //     });
    //     console.log("Nodes List: " + s+ " ende bei " +endNode.id);
    // }
}
