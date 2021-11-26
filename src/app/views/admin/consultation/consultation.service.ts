import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private _http: HttpClient){ }

  async getConditionById(condition_id:string) {
    return await this._http.get(`api/v1/consultation/condition/${condition_id}`).toPromise();
  }
  
  async loadRiskFactors() {
    return await this._http.get(`api/v1/consultation/risk_factors`).toPromise();
  }
  
  async getAllConsultation(data:any){
    return await this._http.post(`api/v1/admin/consultation/all`,data).toPromise();
  }
  
  async getConsultationList(patientId:number,data:any):Promise<any>{
    return await this._http.post(`api/v1/consultation/forPatient?pId=${patientId}`,data).toPromise();
  }

  async getConsultationDetails(id:number){
    return await this._http.get(`api/v1/admin/consultation/details/${id}`).toPromise();
  }

  async removeConsultationMediaById(data:any){
    return await this._http.post(`api/v1/consultation/delete_media`,data).toPromise();
  }

  async getConsultationMedia(consultation_id:number){
    return await this._http.get(`api/v1/consultation/media/${consultation_id}`).toPromise();
  }

  async getMultipleConditions(condition_ids:any){
    return await this._http.get(`api/v1/consultation/conditions?condition_ids=${condition_ids}`).toPromise();
  }
}
