import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactlensesBrandsService {


	constructor(private _http: HttpClient) {}

  async createContactlensesBrand(data:any):Promise<any>{
    return await this._http.post(`api/contactlenses-brands/add`,data).toPromise();
  }

  async updateContactlensesBrand(id:number,data:any):Promise<any>{
    return await this._http.post(`api/contactlenses-brands/update/${id}`,data).toPromise();
  }

  async findAllContactlensesBrands():Promise<any>{
    return await this._http.get(`api/contactlenses-brands/all`).toPromise();
  }

  async findByIdContactlensesBrand(id:number):Promise<any>{
    return await this._http.get(`api/contactlenses-brands/details/${id}`).toPromise();
  }


}
