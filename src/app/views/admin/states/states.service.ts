import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatesService {


	constructor(private _http: HttpClient) {}

  async createState(data:any):Promise<any>{
    return await this._http.post(`api/system_states/add`,data).toPromise();
  }

  async updateState(data:any):Promise<any>{
    return await this._http.post(`api/system_states/update/${data.id}`,data).toPromise();
  }

  async findAllStates():Promise<any>{
    return await this._http.get(`api/system_states/list`).toPromise();
  }

  async findByIdState(id:number):Promise<any>{
    return await this._http.get(`api/system_states/view/${id}`).toPromise();
  }


}
