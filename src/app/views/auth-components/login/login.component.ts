import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup = new FormGroup({
      username:new FormControl(null,[Validators.required]),
      password:new FormControl(null,[Validators.required]),
  });

	validate: boolean = false;
	saving: boolean = false;
	isNotValidCredentials: boolean = false;
	isNotActive: boolean = false;
	error: boolean = false;


  constructor(
    private _router: Router,
    private _toastr:Toastr,
    private _loginService: LoginService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
		this._authService.clearLoggedInUser();

  }

  get username(){return this.loginForm.get('username');}
  get password(){return this.loginForm.get('password');}


  async login(isvalid: boolean) {
		this.validate = true;
		this.saving = false;
    this.isNotValidCredentials = false;
		this.isNotActive = false;
    this.error = false;

		if (isvalid) {
      this.saving = true;
      let result = await this._loginService.login(this.loginForm.value.username, this.loginForm.value.password);
			if (result && !result.error){
				this._authService.setAuthorizationToken(result.access_token);
				this._authService.changeIsLogoutClicked(false);
				let data = await this._loginService.getLoggedInUser();
				if (data && !data.error){
					this.saving = false;
					this.validate = false;
					if (data.role == 'admin'){
            this._authService.saveUser(data);
						this._router.navigate(['admin', 'dashboard']);
					} else {
            this._authService.removeAuthorizationToken();
						this.saving = false;
						this.validate = false;
					}
				} else {
					this.saving = false;
					this.validate = false;
          this._toastr.showError('Unable to fetch user details');
				}
			} else if (!result || result.error) {
				this.saving = false;
				this.validate = false;
        if (result.message_code == 'INVALID_CREDENTIALS') {
					this.isNotValidCredentials = true;
				} else if (result.message_code == 'ACCOUNT_INACTIVE') {
					this.isNotActive = true;
				} else {
					this._toastr.showError('Unable to login');
				}
			}
		}
	}

}
