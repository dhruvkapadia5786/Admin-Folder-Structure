import { BaseModel } from "./BaseModel";
import { User } from "./User";
import { MedicineKit } from "./MedicineKit";
import DiscountCoupon from "./DiscountCoupon";

export class Order extends BaseModel {
    id!: number;
    order_number!: number;
    attempt!: number;
    quantity!: number;
    total_amount!: number;
    is_prescribed!: boolean;
    is_shipped!: boolean;
    prescribed_on!: Date;
    shipped_on!: Date;
    tracking_id!: string;
    charge_id!: any;
    shipping_details!: string;
    status!: number;
    barcode!: string;
    is_active!: boolean;
    assigned_to_id!: number;
    medicine_kit_id!: number;
    prescribed_by_id!: number;
    shipped_by_id!: number;
    tele_daddy_user_id!: number;
    user!: User;
    prescribed_user!: User;
    shipped_user!: User;
    medicineKit!: MedicineKit;
    discountCoupon!: DiscountCoupon;
    autoRefilled!: boolean;
    subscription!: number;

    system_status!: number;
    customer_status!: number;
    technician_status!: number;
    pharmacy_status!: number;
    doctor_status!: number;

    label_url!: string;
    tracking_url!: string;

    constructor() {
        super();
        this.user = new User();
        this.prescribed_user = new User()
        this.shipped_user = new User();
        this.medicineKit = new MedicineKit();
        this.system_status = 0;
        this.customer_status = 0;
        this.technician_status = 0;
        this.pharmacy_status = 0;
        this.doctor_status = 0;
        this.discountCoupon = new DiscountCoupon();
    }
}
