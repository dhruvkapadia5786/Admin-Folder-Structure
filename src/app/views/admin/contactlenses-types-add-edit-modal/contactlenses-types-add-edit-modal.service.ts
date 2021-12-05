import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContactLensesTypesAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewType(bodyData: any):Promise<any>{
    return await this._http.post('api/contact_lens/create_type', bodyData).toPromise();
  }

  async editType(id: any, bodyData: any):Promise<any>{
		return await this._http.post('api/contact_lens/update_type/'+id, bodyData).toPromise();
  }

}
