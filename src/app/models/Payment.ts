export class Payment {
    token_id!: string;
    order_id!: any;
    amount: number;
    email!: string;
    card_token!: string;
    discount_coupon!: string;
    discount!: number;
    total_amount!: number;
    constructor() {
        this.amount = 500;
        this.discount = 0;
        this.total_amount = 0;
    }
}