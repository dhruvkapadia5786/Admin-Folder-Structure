import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactlensesColorsService {


	constructor(private _http: HttpClient) {}

  async createContactlensesColor(data:any):Promise<any>{
    return await this._http.post(`api/contactlenses-colors/add`,data).toPromise();
  }

  async updateContactlensesColor(id:number,data:any):Promise<any>{
    return await this._http.post(`api/contactlenses-colors/update/${id}`,data).toPromise();
  }

  async findAllContactlensesColors():Promise<any>{
    return await this._http.get(`api/contactlenses-colors/all`).toPromise();
  }

  async findByIdContactlensesColor(id:number):Promise<any>{
    return await this._http.get(`api/contactlenses-colors/details/${id}`).toPromise();
  }


}
