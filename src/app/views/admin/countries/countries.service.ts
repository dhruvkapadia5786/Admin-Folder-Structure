import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


	constructor(private _http: HttpClient) {}

  async createCountry(data:any):Promise<any>{
    return await this._http.post(`api/system_states/add`,data).toPromise();
  }

  async updateCountry(data:any):Promise<any>{
    return await this._http.post(`api/system_states/update/${data.id}`,data).toPromise();
  }

  async findAllCountry():Promise<any>{
    return await this._http.get(`api/system_states/list`).toPromise();
  }

  async findByIdCountry(id:number):Promise<any>{
    return await this._http.get(`api/system_states/view/${id}`).toPromise();
  }


}
