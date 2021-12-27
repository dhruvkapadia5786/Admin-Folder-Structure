import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DrugFormAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewDrugForm(bodyData: any):Promise<any>{
    return await this._http.post('api/drugforms/create', bodyData).toPromise();
  }

  async editDrugForm(id: any, bodyData: any):Promise<any>{
		return await this._http.post('api/drugforms/update/'+id, bodyData).toPromise();
  }
}
