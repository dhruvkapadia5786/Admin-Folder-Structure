export class Payment {
  token_id!: string;

  order_id!: any;
  amount: number;
  event_type!:string;

  email!: string;
  card_token!: string;
  selectedCard!:string;

  discount_coupon!: string;
  discount!: number;
  total_amount!: number;

  is_express_shipping!:boolean;
  shipping_charge!:number;
  shipping_method?:string|null;
  is_special_packing!:boolean;
  packing_charge!:number;

  referral_code?:string|null;
  referral_discount!:number;
  first_order_offer_discount!:number;
  charged_from_wallet!:number;
  charged_from_paymentgateway!:number;
  idempotency_key!:string;

  constructor() {
      this.amount = 0;
      this.discount = 0;
      this.first_order_offer_discount = 0;
      this.total_amount = 0;
      this.is_express_shipping = false;
      this.shipping_method = null;
      this.shipping_charge = 0;
      this.is_special_packing = false;
      this.packing_charge = 0;
      this.referral_code= null;
      this.referral_discount = 0;
      this.charged_from_wallet = 0;
      this.charged_from_paymentgateway = 0;
  }
}
