import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ResetPasswordService {
  constructor(private _http: HttpClient) {}

  async checkUsername(token: any) {
    var result = await this._http
      .get<any>(`api/v1/users/exists/${token}`)
      .toPromise();
    return result;
  }

  async resetPassword(token:string, password:string) {
    var result = await this._http
      .post<any>(`api/v1/users/resetpassword`, {
        token: token,
        password: password
      })
      .toPromise();
    return result;
  }
}
