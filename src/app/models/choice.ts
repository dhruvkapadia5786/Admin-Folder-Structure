import { BaseModel } from "./BaseModel";

export class Choice extends BaseModel {
text!:string;
isChecked!:boolean;
result!:string|number;
consent_message?:string|null;
has_file_upload?:number|null;
custom_file_upload?: any|null;
}
