import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { PnElement } from "./pn-element";
import { Transition } from "./pn-transition";

export class PnUtils {
    /**
     * creates a list for each combination of the specified ids 
     * @param ids 
     * @returns list of lists
     */
    static getCombinationsOfIds(ids: string[]): string[][] {
        let combis: string[][] = [];
        while (ids.length > 1) {
            //minimal combination consists of 2 values
            let combi_len: number = 2;
            while (combi_len <= ids.length) {

                combis.push(...this.getCombinationsOfLength(ids, combi_len))
                combi_len++;
            }

            //remove first element
            ids.splice(0, 1);
        }

        return combis;
    }

    private static getCombinationsOfLength(ids: string[], len: number): string[][] {
        let combis: string[][] = [];

        let start: number = 1;
        let end: number = start + len - 1;
        while (end <= ids.length) {
            //always add first element and combination of <len-1> other elements
            let combi: string[] = [ids[0], ...ids.slice(start, end)];
            combis.push(combi);

            start++;
            end++;
        }

        return combis;

    }

    static printCombis(combis: string[][]): void {
        let listOfLists: string = "["
        for (let list of combis) {
            listOfLists += "["
            for (let value of list)
                listOfLists += value + ","
            listOfLists = listOfLists.substring(0, listOfLists.length - 1) + "]";
        }

        listOfLists += "]"

        console.log(listOfLists)
    }

    static getIds(elements: Array<PnElement>): Array<string> {
        return elements.map(el => el.id)
    }
    /**
     * creates a map of corresponding split-OR and join-OR gateways
     * @param nodes 
     * @returns 
     */
    static getMatchingOrGateways(nodes: Array<BpmnNode>): Map<BpmnNode, BpmnNode> {

        let map = new Map<BpmnNode, BpmnNode>();

        nodes.filter(node => BpmnUtils.isSplitOr(node)).forEach(
            splitOr => {
            let joinOr = BpmnUtils.getCorrespondingOrJoin(splitOr)
            if (joinOr)
                map.set(splitOr, joinOr)
        })

        return map;
    }
    /**
     * creates a map of transitions that correspond to the same split-join gateway
     * @param splits transitions representing split-gateways
     * @param joins transitions representing join-gateways
     * @returns 
     */
    static getMatchingOrSplitJoinTransitions(splits: Array<Transition>, joins: Array<Transition>): Map<Transition, Transition> {
        let map = new Map<Transition, Transition>();
        splits.forEach(split => {
            let matchingJoin = joins.find(join => this.sameIndex(join, split))
            if (matchingJoin != undefined)
                map.set(split, matchingJoin)
        })
        return map;
    }

    private static sameIndex(transOne: Transition, transTwo: Transition): boolean {
        return transOne.id.endsWith(transTwo.id.charAt(transTwo.id.length - 1))
    }



}