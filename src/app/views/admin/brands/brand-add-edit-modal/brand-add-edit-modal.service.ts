import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any) {
    this.editDataObj = data;
  }

  getData() {
    return this.editDataObj;
  }

  async addNewBrand(bodyData: any) {
    return await this._http.post('api/brands/create', bodyData).toPromise();
  }

  async editBrand(id: number, bodyData: any) {
		return await this._http.post('api/brands/update/'+id, bodyData).toPromise();
  }

}
