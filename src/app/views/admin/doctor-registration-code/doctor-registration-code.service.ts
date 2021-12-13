import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorRegistrationCodeService {

	constructor(private _http: HttpClient) {}

  async findAllCodes():Promise<any>{
    return await this._http.get(`api/doctor-registration-codes/all`).toPromise();
  }

  async findByIdCode(id:number):Promise<any>{
    return await this._http.get(`api/doctor-registration-codes/details/${id}`).toPromise();
  }

  async deleteCodeById(id:number):Promise<any>{
    return await this._http.post(`api/doctor-registration-codes/delete/${id}`,{}).toPromise();
  }

}
