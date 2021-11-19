import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewState(bodyData: any):Promise<any>{
    return await this._http.post('api/system_states/create', bodyData).toPromise();
  }

  async editState(id: any, bodyData: any):Promise<any>{
		return await this._http.post('api/system_states/update/'+id, bodyData).toPromise();
  }
}
