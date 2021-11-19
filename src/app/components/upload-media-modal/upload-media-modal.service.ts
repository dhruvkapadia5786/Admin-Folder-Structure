import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UploadMediaModalService {
    constructor(private _http: HttpClient) {}
    private formData:any;

    setFormData(data:any){
        this.formData = data;
    }

    getFormData(){
        return this.formData;
    }

    resetForm(reset:boolean){
        return reset;
    }
}
