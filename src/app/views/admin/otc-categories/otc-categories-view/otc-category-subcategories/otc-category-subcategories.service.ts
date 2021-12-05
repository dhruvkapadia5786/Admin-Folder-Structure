import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtcCategorySubcategoriesService {

  
	constructor(private _http: HttpClient) {}

  async createOTCSubCategory(data:any):Promise<any>{
    return await this._http.post(`api/v1/admin/otc-categories/add-subcategory`,data).toPromise();
  }

  async updateOTCSubCategory(id:number,data:any):Promise<any>{
    return await this._http.post(`api/v1/admin/otc-categories/update-subcategory/${id}`,data).toPromise();
  }

  async findAllOTCSubCategory(id:number,data:any):Promise<any>{
    return await this._http.post(`api/v1/admin/otc-categories/all-subcategories-by-category/${id}`,data).toPromise();
  }

  async findByIdOTCSubCategory(id:number):Promise<any>{
    return await this._http.get(`api/v1/admin/otc-categories/subcategory-details/${id}`).toPromise();
  }
 


}
