import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DrugFormsService {


	constructor(private _http: HttpClient) {}

  async createState(data:any):Promise<any>{
    return await this._http.post(`api/drugforms/add`,data).toPromise();
  }

  async updateState(data:any):Promise<any>{
    return await this._http.post(`api/drugforms/update/${data.id}`,data).toPromise();
  }

  async findAllStates():Promise<any>{
    return await this._http.get(`api/drugforms/list`).toPromise();
  }

  async findByIdState(id:number):Promise<any>{
    return await this._http.get(`api/drugforms/view/${id}`).toPromise();
  }


}
