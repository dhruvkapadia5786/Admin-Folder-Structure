import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TherapyAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewTherapy(bodyData: any):Promise<any>{
    return await this._http.post('api/therapies/create', bodyData).toPromise();
  }

  async editTherapy(id: any, bodyData: any):Promise<any>{
		return await this._http.post('api/therapies/update/'+id, bodyData).toPromise();
  }
}
