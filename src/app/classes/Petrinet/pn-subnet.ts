import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { BpmnUtils } from "../Basic/Bpmn/BpmnUtils";
import { Arc } from "./arc";
import { Place } from "./pn-place";
import { PnElement } from "./pn-element";
import { Transition } from "./pn-transition";

/**
 * combination of petri net transitions and places that represent BPMN element
 */
export abstract class PnSubnet {
    id: string;


    _transitions: Array<Transition>;
    _places: Array<Place>;
    _arcs: Array<Arc>;

    errors: string = ""


    constructor(public bpmnNode: BpmnNode) {

        this.id = bpmnNode.id
        this._transitions = new Array<Transition>();
        this._places = new Array<Place>();
        this._arcs = new Array<Arc>();

    }

    get transitions(): Array<Transition> {
        return this._transitions;
    }
    get arcs(): Array<Arc> {
        return this._arcs;
    }

    get label(): string {

        if (this.bpmnNode.label)
            return this.bpmnNode.label
        return this.bpmnNode.id

    }

    abstract get transitionsToConnectToNextSubnet(): Array<Transition>

    abstract get placeToConnectToPreviousSubnet(): Place | undefined



    public get places(): Array<Place> {
        return this._places;
    }

    /**
   * find one of the transitions that is not connected to the following PN-Subnet yet
   */
    findNotConnectedTransition(): Transition | undefined {
        return this.transitions.find(trans => trans.notConnected())
    }

    /**
    * find one of the input places that is not connected to preceding PN-Subnet yet
    */
    findNotConnectedPlace(): Place | undefined {
        return this.places.find(place => place.notConnected())
    }

    arcExists(arcToCheck: Arc): boolean {


        for (let arc of this.arcs) {

            let sameFromElement = arcToCheck.from === arc.from
            let sameToElement = arcToCheck.to === arc.to

            if (sameFromElement && sameToElement)
                return true;

        }

        return false;
    }

    addArc(arc: Arc) {

        if (!this.arcExists(arc))
            this.arcs.push(arc)

    }



    addPlace(place: Place): Place {
        if (!this.places.includes(place))
            this.places.push(place)

        return place
    }

    addTransition(trans: Transition): Transition {
        if (!this.transitions.includes(trans))
            this.transitions.push(trans)

        return trans
    }

    getTransitionsByIds(ids: Array<string>): Array<Transition> {
        return this.transitions.filter(trans => ids.includes(trans.id))
    }

    getTransitionById(id: string): Transition | undefined {
        return this.transitions.find(trans => id === trans.id)
    }

}