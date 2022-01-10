export default class DiscountCoupon {
  _id!: any;
  coupon_code!: string;
  coupon_name!: string;
  created_at!: number;
  deleted_at?: number;
  discount_amount!: number;
  discount_percent!: number;
  expiry!: string;
  is_used!: number;
  start!: string;
  updated_at?: number;
  use_count_all_user!: number;
  use_count_sigle_user!: number;

  constructor() {

  }

}
