import { BaseModel } from "./BaseModel";
import Address from "./Address";

export class User extends BaseModel {
  first_name!: string;
  last_name!: string;
  email!: string;
  gender!: string;
  date_of_birth!: string|null;
  role!: string;
  password!: string;
  cell_phone_number!: any;
  email_phone_consent!: boolean|null;
  license_image!: string;
  profile_picture!: string;
  default_address!: Address;
  age?: number;
  addresses!: Array<Address>;

  wallet_balance!:number;

  last_login?:number;

  blood_pressure?:any;
  height_weight?:any;

  surgical_history?:any;
  surgical_history_updated_at?:any;
  social_history?:any;
  social_history_updated_at?:any;
  family_history?:any;
  family_history_updated_at?:any;

  customer_referral_code?:string|null;

  constructor() {
    super();
  }

}
