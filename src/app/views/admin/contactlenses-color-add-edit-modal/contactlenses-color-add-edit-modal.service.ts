import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContactLensesColorAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewColor(bodyData: any):Promise<any>{
    return await this._http.post('api/contact_lens/create_color', bodyData).toPromise();
  }

  async editColor(id: any, bodyData: any):Promise<any>{
		return await this._http.post('api/contact_lens/update_color/'+id, bodyData).toPromise();
  }

}
