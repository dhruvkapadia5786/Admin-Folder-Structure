import {BaseModel} from './BaseModel';
import { User } from './User';

export default class Comment extends BaseModel {
    email!: string;
    comment!: string;
    type!:number|null;
    orderId!:number;
    user!: User;
    commentCategory!: string;
    visibleToCustomer!:any;

    constructor() {
        super();
        this.user = new User();
        this.type = 1;
    }
}
