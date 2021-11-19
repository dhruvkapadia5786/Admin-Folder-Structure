import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {TeledaddyApiEndpoints} from 'src/app/constants/TeledaddyApiEndpoints';

@Injectable()
export class DashboardService {

  constructor(private _http: HttpClient) {

  }

  async getDashboardDetails(): Promise<any> {
      return await this._http.get<any>(TeledaddyApiEndpoints.ADMIN_DASHBOARD).toPromise();
  }

}
