import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class NcpdpDrugFormsService {
    constructor(private _http: HttpClient) {}
    private formData:any;
    private apiResponse:any;

    setFormData(data:any){
        this.formData = data;
    }

    getFormData(){
        return this.formData;
    }

    async getAllNCPDPdrugForms(searchTerm:string):Promise<any>{
        return await this._http.get(`api/medicinekits/ncpdp_drug_forms`+`?search=${searchTerm}`).toPromise();
    }
}
