
export class BaseModel {
    id!:number;
    name:string|null;
    createdOn:Date|null;
    updatedOn:Date|null;
    constructor() {
        this.id = 0;
        this.name='';
        this.createdOn = null;
        this.updatedOn = null;
    }

}
