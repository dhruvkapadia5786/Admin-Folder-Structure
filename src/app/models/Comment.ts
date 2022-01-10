import {BaseModel} from './BaseModel';
import { User } from './User';

export default class Comment {
  _id!:any;
  comment!: string;
  comment_by_id!: User;
  comment_category_id?: any|null=null;
  visible_to_customer:boolean=true;
  created_at!:Date;

  constructor(){
      this.comment_by_id = new User();
  }
}
