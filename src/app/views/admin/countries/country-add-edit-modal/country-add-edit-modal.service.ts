import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewCountry(bodyData: any):Promise<any>{
    return await this._http.post('api/system_countries/create', bodyData).toPromise();
  }

  async editCountry(id: number, bodyData: any):Promise<any>{
		return await this._http.post('api/system_countries/update/'+id, bodyData).toPromise();
  }
}
