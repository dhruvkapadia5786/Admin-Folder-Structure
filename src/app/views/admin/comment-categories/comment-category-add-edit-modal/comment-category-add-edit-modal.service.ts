import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentCategoryAddEditModalService {
  editDataObj: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any){
    this.editDataObj = data;
  }

  getData(){
    return this.editDataObj;
  }

  async addNewCommentCategory(bodyData: any):Promise<any>{
    return await this._http.post('api/comment_categories/create', bodyData).toPromise();
  }

  async editCommentCategory(id: number, bodyData: any):Promise<any>{
		return await this._http.post('api/comment_categories/update/'+id, bodyData).toPromise();
  }
}
