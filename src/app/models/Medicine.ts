import { BaseModel } from "./BaseModel";

export class Medicine extends BaseModel {

    medicine_kit_id!:any;
    medicine_kit_name!:string;
    medicine_name!:string;
    direction!:string;
    strength!:string;
    quantity!:any;
    doseform?:string;
    route?:string;
    refills?:number|null;
    price!: number;
    weno_prescription?:any;
    is_prescribed?:number|null;
    prescription_url?:any|null;
    is_prescribed_by_fax?:number|null;
    prescription_send_to_pharmacy?:any;
    ndc_number?:any;
    quantity_unit?:any;
    weight?:any;
    weight_unit?:any;
}
