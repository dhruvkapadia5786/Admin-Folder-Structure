import { BaseModel } from "./BaseModel";

export class State extends BaseModel {

    abbreviation?:string;
    is_vcr?:number;
    constructor(){
        super();
    }
}
