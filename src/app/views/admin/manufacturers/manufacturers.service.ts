import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {


	constructor(private _http: HttpClient) {}

  async createState(data:any):Promise<any>{
    return await this._http.post(`api/manufacturers/add`,data).toPromise();
  }

  async updateState(data:any):Promise<any>{
    return await this._http.post(`api/manufacturers/update/${data.id}`,data).toPromise();
  }

  async findAllStates():Promise<any>{
    return await this._http.get(`api/manufacturers/list`).toPromise();
  }

  async findByIdState(id:number):Promise<any>{
    return await this._http.get(`api/manufacturers/view/${id}`).toPromise();
  }


}
