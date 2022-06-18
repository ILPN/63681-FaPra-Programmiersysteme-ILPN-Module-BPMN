import { Utility } from '../../Utils/Utility';
import { Svg } from '../Svg/Svg';
import { DragHandleEdgeCorner } from './DragHandleEdgeCorner';

export class DragHandleEdgeInnerCorner extends DragHandleEdgeCorner {
    protected override createSvg(): SVGElement {
        const c = Svg.container();
        const dragCircle = Svg.circleNoStyle(
            this.dragedElement.getPos(),
            'dragHandleInnerCorner'
        );
        c.appendChild(dragCircle)
        c.appendChild(this.deleteCircle())

        this.appendListenerTo(dragCircle)

        return c

    }
    deleteCircle(): SVGElement {
        const distance = 10;

        const cornerIndex = this.edge.corners.findIndex(c => c==this.dragedElement)
        if(cornerIndex == -1) return Svg.empty()
        const cornerBefore = this.edge.corners[cornerIndex-1]
        const cornerAfter = this.edge.corners[cornerIndex+1]

        if (cornerAfter == undefined || cornerBefore == undefined)
            return Svg.empty();


        const dir1 = cornerAfter
            .getPos()
            .minus(this.dragedElement.getPos())
            .toUnitVector();
        const dir2 = cornerBefore
            .getPos()
            .minus(this.dragedElement.getPos())
            .toUnitVector();
        let dir = dir1.plus(dir2).muliplied(-1);
        if (dir.isAlmostZero()) {
            const nDir1 = dir1.rotate(Math.PI / 2);
            const nDir2 = dir2.rotate(Math.PI / 2);
            dir = nDir1.y< nDir2.y? nDir1:nDir2 //to avoid delete Circle beeing hidden behind mouse pointer
        } else {
            dir = dir.toUnitVector();
        }
        const pos = this.dragedElement.getPos().plus(dir.muliplied(distance));
        
        const deleteCircle = Svg.circleNoStyle(pos,"deleteCircle")

        //somehow onclick doesnt work after having draged the corner
        //this.svgDelete.onclick = e => this.arrow.removeCorner(this)
        //this.svgDelete.addEventListener("click", () => this.arrow.removeCorner(this));
        Utility.addSimulatedClickListener(deleteCircle, (e) =>
            //this.edge.removeCorner(this)
            this.onClickDelete(cornerIndex)
        );       
       
        return deleteCircle
    }


    private onClickDelete(index:number){
        this.edge.removeCorner(index)
        this._svg?.remove()
    }


    
}
