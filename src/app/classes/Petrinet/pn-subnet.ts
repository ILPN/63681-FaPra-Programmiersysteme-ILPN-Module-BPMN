import { BpmnNode } from "../Basic/Bpmn/BpmnNode";
import { Arc } from "./arc";
import { Place } from "./place";
import { PnElement } from "./pn-element";
import { Transition } from "./transition";

/**
 * combination of petri net transitions and places that represent BPMN element
 */
export class PnSubnet {
    id: string;
    _inputPlace: Place;

    _transitions: Array<Transition>;
    _places: Array<Place>;
    _arcs: Array<Arc>;

    valid: boolean = true
    errors: string = ""


    constructor(public bpmnNode: BpmnNode) {

        this.id = bpmnNode.id;
        this._transitions = new Array<Transition>();
        this._places = new Array<Place>();
        this._arcs = new Array<Arc>();

        //every BPMN element is mapped to a combination of at least one place and following transition
        let transition = this.addTransition(new Transition(bpmnNode.id, bpmnNode.label))
        this._inputPlace = this.addInputPlace();
        this.addArc(Arc.create(this._inputPlace, transition))
    }

    get transitions(): Array<Transition> {
        return this._transitions;
    }
    get arcs(): Array<Arc> {
        return this._arcs;
    }

    get inputPlace(): Place | undefined {
        return this._inputPlace
    }

    public get places(): Array<Place> {
        return this._places;
    }

    setErrorStatus(errors: string) {
        this.valid = false
        this.errors += errors
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

    /**
     * creates new arc to the specified PN element
     * @param to target element
     */
    addArcTo(to: PnElement): { error: string, ok: boolean } {
        let arc: Arc = Arc.create(this.transitions[0], to);
        if (!arc.valid)
            return { error: arc.errors, ok: false }

        this.addArc(arc);

        return { error: "", ok: true }

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

    /**
     * one of the input places of PnSubnet that is not connected to preceding PnSubnet yet
     * @returns 
     */
    findNotConnectedInputPlace(): Place | undefined {

        return this.places.find(place => place.notConnected())
    }

    /**
     * one of the transitions of PnSubnet that is not connected to following PnSubnet yet
     * @returns 
     */
    findNotConnectedTransition(): Transition | undefined {

        return this.transitions.find(trans => trans.notConnected())
    }

    addInputPlace(): Place {
        return this.addPlace(Place.create({ isStartPlace: false }));
    }

    getTransitionsByIds(ids: Array<string>): Array<Transition> {
        return this.transitions.filter(trans => ids.includes(trans.id))
    }

    getTransitionById(id: string): Transition | undefined {
        return this.transitions.find(trans => id === trans.id)
    }

}