import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackformsService {


	constructor(private _http: HttpClient) {}

  async createPackform(data:any):Promise<any>{
    return await this._http.post(`api/packforms/add`,data).toPromise();
  }

  async updatePackform(data:any):Promise<any>{
    return await this._http.post(`api/packforms/update/${data.id}`,data).toPromise();
  }

  async findAllPackforms():Promise<any>{
    return await this._http.get(`api/packforms/list`).toPromise();
  }

  async findByIdPackform(id:number):Promise<any>{
    return await this._http.get(`api/packforms/view/${id}`).toPromise();
  }


}
