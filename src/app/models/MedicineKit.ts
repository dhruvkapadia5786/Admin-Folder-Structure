import { BaseModel } from "./BaseModel";
import { Medicine } from "./Medicine";

export class MedicineKit extends BaseModel {
    price!: number;
    medicines!:Array<Medicine>
    medicine_kit_name!:string;
    medicineDictionary!: {};
    constructor() {
        super();
        this.medicines=new Array<Medicine>();
    }
}