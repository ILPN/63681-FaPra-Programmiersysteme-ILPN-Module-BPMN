export class BEdge{
    private _fromId: string
    public get fromId(): string {
        return this._fromId
    }
    public set fromId(value: string) {
        this._fromId = value
    }
    private _toId: string
    public get toId(): string {
        return this._toId
    }
    public set toId(value: string) {
        this._toId = value
    }
    constructor(fromId:string, toId:string){
        this._fromId = fromId,
        this._toId = toId
    }
}