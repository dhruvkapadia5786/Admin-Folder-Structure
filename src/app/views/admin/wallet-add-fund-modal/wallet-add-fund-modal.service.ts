import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WalletAddFundModalService {
  formdata: any = {};

  constructor(private _http: HttpClient) {}

  setData(data: any) {
    this.formdata = data;
  }

  getData(){
    return this.formdata;
  }

}
