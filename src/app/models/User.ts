import { BaseModel } from "./BaseModel";
import Address from "./Address";

export class User extends BaseModel {
  _id!:any;
  first_name!:string;
  last_name!:string;
  email!:string;
  role!:string;
  cell_phone_number!:number;
  email_phone_consent?:number|null;
  privacy_policy_terms?:number|null;
  profile_picture?:string|null;
  license_image?:string|null;
  email_verified?:boolean|number;
  verify_token?:string|null;
  is_active?:boolean|number;
  account_service_enabled?:boolean|number|null;
  gender?:string;
  date_of_birth?:any;
  age?:number;
  reset_token?:string|null;
  reset_token_expires?:any;
  paymentgateway_customer_id?:string|null;
  customer_referral_code?:string|null;
  add_memo_tab?:number|null;
  default_address?:Address;
  addresses:Address[]=[]

  height_weight?:any;
  blood_pressure?:any;

  surgical_history?:any;
  surgical_history_updated_at?:any;
  social_history?:any;
  social_history_updated_at?:any;
  family_history?:any;
  family_history_updated_at?:any;

  constructor(){
    super();
  }

}
