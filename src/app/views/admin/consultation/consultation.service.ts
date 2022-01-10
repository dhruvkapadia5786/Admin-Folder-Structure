import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private _http: HttpClient){ }

  async getConditionById(condition_id:any) {
    return await this._http.get(`api/v1/consultations/condition/${condition_id}`).toPromise();
  }

  async loadRiskFactors() {
    return await this._http.get(`api/v1/consultations/risk_factors`).toPromise();
  }

  async getAllConsultation(data:any){
    return await this._http.post(`api/consultations/list`,data).toPromise();
  }

  async getConsultationList(patientId:any,data:any):Promise<any>{
    return await this._http.post(`api/v1/consultations/forPatient?pId=${patientId}`,data).toPromise();
  }

  async getConsultationDetails(id:any){
    return await this._http.get(`api/consultations/details/${id}`).toPromise();
  }

  async removeConsultationMediaById(data:any){
    return await this._http.post(`api/v1/consultations/delete_media`,data).toPromise();
  }

  async getConsultationMedia(consultation_id:any){
    return await this._http.get(`api/v1/consultations/media/${consultation_id}`).toPromise();
  }

  async getMultipleConditions(condition_ids:any){
    return await this._http.get(`api/v1/consultations/conditions?condition_ids=${condition_ids}`).toPromise();
  }
}
