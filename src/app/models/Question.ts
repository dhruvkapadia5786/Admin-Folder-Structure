import { BaseModel } from "./BaseModel";
import { Choice } from "./choice";

export class Question extends BaseModel {
    text!:string;
    question_type!:string;
    is_multi_select!:boolean;
    has_input!:boolean;
    choices:Array<Choice>;
    custom_input?:any;
    sub_questions?:any[];
    parent_question_id?:any;

    user_answer_id?:any;
    consent_message?:string|null;
    has_given_consent?:number|null;
    consent_sent_datetime?:any|null;
    consent_received_datetime?:any|null;

    constructor(){
        super();
        this.choices=new Array<Choice>();
        this.custom_input=null;
        this.sub_questions=[];
        this.parent_question_id=null;
    }

}
