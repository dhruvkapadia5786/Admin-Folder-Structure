import { BaseModel } from "./BaseModel";
import { Medicine } from "./Medicine";

export class MedicineKit extends BaseModel {

    brand_id!:any;
    treatment_condition_ids!:any[];
    slug!: string;
    description!: string;
    is_active!:boolean|null;
    is_coming_soon!:boolean|null;
    image_url!:string;

    is_auto_refill?:boolean|null;
    default_refill?:number;
    refill_frequency?:number|null;

    images?:any[]=[];
    documents?:any[]=[];
    videos?:any[]=[];
    states?:any[]=[];
    icd10_codes?:any[]=[];
    faqs?:any[]=[];
    attributes?:any[]=[];
    questions?:any[]=[];
    medicines!: Array<Medicine>
    tab_name!: string;
    tab_url!: string;

    price!: number;
    pharmacy_price!: number;
    doctor_price!: number;

    is_offer?:boolean|null;
    offer_price?:number|null;

    is_special_kit!:boolean|null;
    default_special_pharmacy_id?:number|null;
    is_custom_pharmacy_allowed?: boolean|null;

    constructor(){
        super();
    }

}
