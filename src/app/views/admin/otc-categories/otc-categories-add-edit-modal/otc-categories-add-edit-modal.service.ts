import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtcCategoriesAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewOtcCategories(bodyData: any):Promise<any>{
    return await this._http.post('api/otc_categories/create', bodyData).toPromise();
  }

  async editOtcCategories(id: number, bodyData: any):Promise<any>{
		return await this._http.post('api/otc_categories/update/'+id, bodyData).toPromise();
  }
}
