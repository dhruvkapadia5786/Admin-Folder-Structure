import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultationHealthConditionsService {
	constructor(private _http: HttpClient) {}

  async createHealthConditions(data:any):Promise<any>{
    return await this._http.post(`api/consultation_health_conditions/create`,data).toPromise();
  }

  async updateHealthConditions(id: any, data:any):Promise<any>{
    return await this._http.post(`api/consultation_health_conditions/update/${id}`,data).toPromise();
  }

  async findAllHealthConditions():Promise<any>{
    return await this._http.get(`api/consultation_health_conditions/active`).toPromise();
  }

  async findByIdHealthConditions(id:any):Promise<any>{
    return await this._http.get(`api/consultation_health_conditions/view/${id}`).toPromise();
  }


}
