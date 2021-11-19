import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreatmentConditionAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewHealthCondition(bodyData: any):Promise<any>{
    return await this._http.post('api/health_conditions/create', bodyData).toPromise();
  }

  async editHealthCondition(id: number, bodyData: any):Promise<any>{
		return await this._http.post('api/health_conditions/update/'+id, bodyData).toPromise();
  }
}
