import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtcSubcategoriesAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewOtcSubcategories(bodyData: any):Promise<any>{
    return await this._http.post('api/otc_subcategories/create', bodyData).toPromise();
  }

  async editOtcSubcategories(id: number, bodyData: any):Promise<any>{
		return await this._http.post('api/otc_subcategories/update/'+id, bodyData).toPromise();
  }
}
