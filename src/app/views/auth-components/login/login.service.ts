import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {GolfedApiEndpoints} from "src/app/constants/GolfedApiEndpoints";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  async login(username: string, password: string): Promise<any> {


    const BASIC_HEADER_TOKEN = 'Basic YWRtaW46c2VjcmV0T0F1dGgyYWRtaW4=';
    let body =
      "username=" +
      encodeURIComponent(username) +
      "&password=" +
      encodeURIComponent(password) +
      "&grant_type=password";

    let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':BASIC_HEADER_TOKEN });
    let options = { headers: headers };

    var result = await this._http
      .post<any>(GolfedApiEndpoints.LOGIN, body,options)
      .toPromise()
      .catch(err => {
        console.log('error=',err);
        return err.error;
      });
    return result;
  }

  async getLoggedInUser(): Promise<any> {
    var result = await this._http.get<any>(GolfedApiEndpoints.ME).toPromise();
    return result;
  }


}
