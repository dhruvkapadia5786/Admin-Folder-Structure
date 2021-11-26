import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private _http: HttpClient){ }


  async viewClinic(clinic_id:any){
    return await this._http.get(`api/clinics/view/${clinic_id}`).toPromise();
  }

  async viewClinicByDoesspotClinicId(clinic_by_doesspot_id:any){
    return await this._http.get(`api/clinics/clinic_by_doesspot_id/${clinic_by_doesspot_id}`).toPromise();
  }

  async updateClinic(clinic_id:any,data:any){
    return await this._http.post(`api/clinics/update/${clinic_id}`,data).toPromise();
  }

  async addClinic(data:any){
    return await this._http.post(`api/clinics/create`,data).toPromise();
  }

  async getAllClinic(){
    return await this._http.get(`api/clinics/list`).toPromise();
  }



}
