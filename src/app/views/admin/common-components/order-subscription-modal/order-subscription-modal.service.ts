import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class OrderSubscriptionModalService {
    constructor(private _http: HttpClient) {}
    private formData:any;
    private apiResponse:any;

    setFormData(data:any){
        this.formData = data;
    }

    getFormData(){
        return this.formData;
    }

    getApiResponse(){
        return this.apiResponse;
    }

    setApiResponse(response:any){
        this.apiResponse=response;
    }
}