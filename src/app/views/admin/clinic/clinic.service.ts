import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private _http: HttpClient){ }


  async viewClinic(doesspot_clinic_id:number){
    return await this._http.get(`api/clinics/view/${doesspot_clinic_id}`).toPromise();
  }

  async viewClinicByDoesspotClinicId(clinic_by_doesspot_id:number){
    return await this._http.get(`api/clinics/clinic_by_doesspot_id/${clinic_by_doesspot_id}`).toPromise();
  }

  async updateClinic(doesspot_clinic_id:number,data:any){
    return await this._http.post(`api/clinics/update/${doesspot_clinic_id}`,data).toPromise();
  }

  async addClinic(data:any){
    return await this._http.post(`api/clinics/create`,data).toPromise();
  }

  async getAllClinic(){
    return await this._http.get(`api/clinics/list`).toPromise();
  }



}
