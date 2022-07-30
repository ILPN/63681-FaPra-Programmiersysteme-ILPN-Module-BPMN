import { inheritInnerComments } from "@babel/types"

export class Table<T>{
    private notInTable:T[] = []
    private table:Cell<T>[][] = []
    constructor(nOfRows:number, nOfColumns:number){
        for (let i = 0; i < nOfRows; i++) {
            const row = []
            for (let j = 0; j < nOfColumns; j++) {
                row.push(new Cell<T>(i,j))
            }
            this.table.push(row)
        }
    }
}
class Cell<T>{
    private _i
    public get i() {
        return this._i
    }
    public set i(value) {
        this._i = value
    }
    private _j
    public get j() {
        return this._j
    }
    private _content: T[] = []
    public getContent(): T[] {
        return [...this._content]
    }
    add(element:T){
        this._content.push(element)
    }
    remove(element:T){
        this._content = this._content.filter(e => e!==element)
    }
    constructor(i:number, j:number){
        this._i = i
        this._j = j
    }
}