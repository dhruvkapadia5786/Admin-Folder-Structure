import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-tech',
  templateUrl: './edit-tech.component.html',
  styleUrls: ['./edit-tech.component.scss']
})
export class EditTechComponent implements OnInit {
  addTechnician: FormGroup
  technicianObj: any;
  techId: any;
  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private _helper: Helper
  ) {

    this.addTechnician = new FormGroup({
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'gender': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'cell_phone_number': new FormControl(null, [Validators.required]),
      'email_phone_consent': new FormControl(null),
      'is_active': new FormControl(null),
      'add_memo_tab': new FormControl(null),
    });
  }

  ngOnInit() {
    this.techId = this.route.snapshot.paramMap.get('id');
    this.getTechDetails();
  }
  get first_name() { return this.addTechnician.get('first_name'); }
  get last_name() { return this.addTechnician.get('last_name'); }
  get gender() { return this.addTechnician.get('gender'); }
  get email() { return this.addTechnician.get('email'); }
  get cell_phone_number() { return this.addTechnician.get('cell_phone_number'); }
  get email_phone_consent() { return this.addTechnician.get('email_phone_consent'); }
  get is_active() { return this.addTechnician.get('is_active'); }
  get add_memo_tab() { return this.addTechnician.get('add_memo_tab'); }


  getTechDetails(){
    const url = 'api/technicians/view/' + this.techId;
    this.http.get(url).subscribe((tech: any) => {
        this.technicianObj = tech;
        this.addTechnician.patchValue({
          first_name:tech.first_name,
          last_name: tech.last_name,
          gender: tech.gender,
          email: tech.email,
          cell_phone_number: tech.cell_phone_number,
          email_phone_consent:tech.email_phone_consent,
          is_active: tech.is_active,
          add_memo_tab:tech.add_memo_tab
        });
      }, (err:any) => {
      });
  }

  saveTechnician(){
    if (this.addTechnician.invalid) {
      this._helper.markFormGroupTouched(this.addTechnician);
      return;
    }
    const url = 'api/technicians/update/' + this.techId;
    this.http.post(url,this.addTechnician.value).subscribe((data: any) => {
        if (data != null){
          this._router.navigate(['/admin/technicians/list']);
          this._toastr.showSuccess('Save Successfully');
        } else {
          this._toastr.showError('Unable to save technician.');
        }
        this._changeDetectorRef.detectChanges();
      },
      (err:any) => {
        this._toastr.showError('Unable to save technician.');
        this._changeDetectorRef.detectChanges();
      }
    );
  }
}
