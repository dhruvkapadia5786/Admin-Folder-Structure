import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TherapiesService {


	constructor(private _http: HttpClient) {}

  async createTherapy(data:any):Promise<any>{
    return await this._http.post(`api/therapies/add`,data).toPromise();
  }

  async updateTherapy(data:any):Promise<any>{
    return await this._http.post(`api/therapies/update/${data.id}`,data).toPromise();
  }

  async findAllTherapys():Promise<any>{
    return await this._http.get(`api/therapies/list`).toPromise();
  }

  async findByIdTherapy(id:number):Promise<any>{
    return await this._http.get(`api/therapies/view/${id}`).toPromise();
  }


}
