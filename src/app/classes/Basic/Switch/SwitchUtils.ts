import { SwitchableGateway } from "./SwitchableGateway";
import { SwitchableNode } from "./SwitchableNode";

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
    public static isGateway(node: SwitchableNode): boolean{
        return node instanceof SwitchableGateway
    }
}