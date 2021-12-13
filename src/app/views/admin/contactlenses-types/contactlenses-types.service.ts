import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactlensesTypesService {


	constructor(private _http: HttpClient) {}

  async createContactlensesType(data:any):Promise<any>{
    return await this._http.post(`api/contactlenses-types/add`,data).toPromise();
  }

  async updateContactlensesType(id:number,data:any):Promise<any>{
    return await this._http.post(`api/contactlenses-types/update/${id}`,data).toPromise();
  }

  async findAllContactlensesTypes():Promise<any>{
    return await this._http.get(`api/contactlenses-types/all`).toPromise();
  }

  async findByIdContactlensesType(id:number):Promise<any>{
    return await this._http.get(`api/contactlenses-types/details/${id}`).toPromise();
  }


}
