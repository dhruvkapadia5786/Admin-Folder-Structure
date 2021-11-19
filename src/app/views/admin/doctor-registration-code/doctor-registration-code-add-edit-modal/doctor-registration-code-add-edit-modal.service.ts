import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorRegistrationCodeAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) { }

  setData(data: any) {
    this.editDataObj = data;
  }

  getData() {
    return this.editDataObj;
  }

  async createCode(data:any):Promise<any>{
    return await this._http.post(`api/doctor_registration_codes/create`,data).toPromise();
  }

  async updateCode(data:any):Promise<any>{
    return await this._http.post(`api/doctor_registration_codes/update/${data._id}`,data).toPromise();
  }
}
