import { BaseModel } from "./BaseModel";
import { MedicineKit } from "./MedicineKit";
import DiscountCoupon from "./DiscountCoupon";
import { User } from './User';

export class Order extends BaseModel {

    order_number!: string;
    order_number_text?: string|null=null;

    order_type!:string;
    ordered_quantity!: number;
    rate_per_quantity!: number;
    line_total_amount!: number;
    total_amount!: number;
    tax_amount!: number;
    subtotal_amount!: number;

    is_special_packing?:boolean;
    packing_charge?:number;

    medicine_kit_id!:any;

    is_prescribed!: boolean;
    is_shipped!: boolean;
    prescribed_on!: Date;
    shipped_on!: Date;
    tracking_id!: string;

    charge_id?: any;
    paymentgateway_order_id?:any;

    is_active!: boolean;

    assigned_to_id!: any;
    prescribed_by_id!: any;
    shipped_by_id!: any;
    tele_daddy_user_id?: number;

    user_id!: User;
    discountCoupon?: DiscountCoupon;
    referralCoupon!:any;

    system_status!: string;
    customer_status!: string;
    technician_status!: string;
    pharmacy_status?: string;
    doctor_status?: string;

    label_url!: string;
    tracking_url!: string;

    is_questions_completed?:boolean|null;
    is_payment_completed?:boolean|null;
    is_consent_completed?:boolean|null;
    is_profile_upload_completed?:boolean|null;
    is_license_upload_completed?:boolean|null;
    order_place_datetime!:string|Date|null;

    is_transferred?:boolean;
    transferred_pharmacy?:any|null;
    transferred_to_pharmacy_id?:any|null;
    order_transfer_datetime?:string|Date|null;

    coupon_discount:number=0;
    referral_discount:number=0;

    charged_from_wallet!:number;
    charged_from_paymentgateway!:number;

    shipping_address?:any;
    shipping_method?:any;
    is_express_shipping?:boolean;
    shipping_charge?:number;

    doctor_details?:any;

    is_closed?:boolean|null;
    order_closed_reason?:string|null;
    order_closed_datetime?:any;

    order_refund_reason?:string|null;
    order_refund_requested_on?:any|null;

    is_payment_authorization_required?:number|null;

    constructor() {
        super();

    }
}
