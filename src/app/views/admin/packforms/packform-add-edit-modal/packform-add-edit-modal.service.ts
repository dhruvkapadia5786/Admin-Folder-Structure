import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackformAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewPackform(bodyData: any):Promise<any>{
    return await this._http.post('api/packforms/create', bodyData).toPromise();
  }

  async editPackform(id: any, bodyData: any):Promise<any>{
		return await this._http.post('api/packforms/update/'+id, bodyData).toPromise();
  }
}
