export class BNode{
    private readonly _id: string
    public get id(): string {
        return this._id
    }
    constructor(id:string){
        this._id = id
    }
}