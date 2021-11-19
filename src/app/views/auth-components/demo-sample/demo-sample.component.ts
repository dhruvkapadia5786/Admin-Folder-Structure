import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demo-sample',
  template: `<p></p>`
})
export class DemoSampleComponent implements OnInit {
	routeParams: any;
	constructor(
		private _loginService: LoginService,
		private _authService: AuthService,
		private _router: Router,
		private _route: ActivatedRoute){

     }

	ngOnInit() {
	this._authService.clearLoggedInUser();

    this._route.queryParams.subscribe((params:any) => {
			this.routeParams = {
				token: params['token'],
				userId: params['user']
			}
		})
		if (this.routeParams.token && this.routeParams.userId) {
			this._authService.validateToken(this.routeParams.token).subscribe((res:any) => {
        if(res){
					this.demoSampleTest();
				}
			}, (err:any) => err);
		}
  }

  async demoSampleTest(){
		this._authService.setAuthorizationToken(this.routeParams.token);
		this._authService.changeIsLogoutClicked(false);
		let data = await this._loginService.getLoggedInUser();
		if (data && !data.error) {
			this._authService.saveUser(data);
			if (data.type == 1){
				this._router.navigate(['admin', 'dashboard']);
			}
		} else {

		}
	}

}
