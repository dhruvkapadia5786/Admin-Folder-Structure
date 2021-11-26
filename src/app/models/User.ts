import { BaseModel } from "./BaseModel";
import Address from "./Address";

export class User extends BaseModel {
  firstName!: string;
  lastName!: string;
  email!: string;
  pinCode!: number|null;
  addressLine1!: string;
  addressLine2!: string;
  gender!: string;
  dateOfBirth!: string|null;
  state!: number;
  type!: number;
  password!: string;
  phoneNumber!: any;
  emailConsent!: boolean|null;
  consent!: boolean;
  licenseNumber!: string;
  licenseImage!: string;
  profileImage!: string;
  address!: Address;
  age: number;
  cardLast4!: number;
  cardExpiryMonth!: number;
  cardExpiryYear!: number;
  practiceAddresses!: Array<Address>;
  pharmacy_name!: string;

  portal_usage?:string|null;
  all_agreement_signed?:boolean|null;

  profile_bmi?:any;
  profile_bp?:any;

  profile_surgical_history?:any;
  profile_social_history?:any;
  profile_family_history?:any;

  customer_referral_code?:string|null;

  constructor() {
    super();
    this.age = 0;
    this.gender = "";
    this.state = 0;
    this.pinCode = null;
    this.email = '';
    this.type = 1;
    this.password = "";
    this.emailConsent = null;
    this.dateOfBirth = null;
    this.address = new Address();
    this.practiceAddresses = new Array<Address>();
    this.profile_bmi = null;
    this.profile_bp = null;
    this.profile_surgical_history =null;
    this.profile_social_history =null;
    this.profile_family_history =null;
    this.portal_usage=null;
    this.all_agreement_signed = null;
  }

}
