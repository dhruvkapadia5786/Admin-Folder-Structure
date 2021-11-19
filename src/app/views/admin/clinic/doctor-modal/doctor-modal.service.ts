import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorModalService {
  dataObj: any = {};

  constructor() { }

  setData(data: any) {
    this.dataObj = data;
  }

  getData() {
    return this.dataObj;
  }
}
