import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  systemSettingsDetails: any;
  public systemSettings!: FormGroup;

  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _http: HttpClient,
    public activeRoute: ActivatedRoute,
    public _helper: Helper
  ) {
    this.systemSettings = new FormGroup({
      'entries': new FormArray([])
    });
  }

  ngOnInit() {
    this.getSystemSettingsDetails();
  }

  newEntry(): FormGroup {
    return new FormGroup({
      'id': new FormControl(null, []),
      'title': new FormControl('', [Validators.required]),
      'value': new FormControl('', [Validators.required]),
      'deletable': new FormControl(1, []),
    });
  }

  addEntry() {
    this.entries().push(this.newEntry());
  }

  removeEntry(empIndex: number) {
    let val = this.entries().at(empIndex).value;

    const url = 'api/admin/system_settings/delete/' + val.id;
    this._http.post(url, {}).subscribe((data: any) => {
      this.entries().removeAt(empIndex);
      this.getSystemSettingsDetails();
    });
  }

  entries(): FormArray {
    return this.systemSettings.get("entries") as FormArray
  }




  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  getSystemSettingsDetails() {
    const url = 'api/admin/system_settings/all';
    this._http.get(url).subscribe((data: any) => {
      this.systemSettingsDetails = data;
      this.clearFormArray(this.entries());
      const entryControl = this.systemSettings.get('entries') as FormArray;
      data.forEach((item: any) => {
        let shFormGroup = new FormGroup({
          'id': new FormControl(item.id, []),
          'title': new FormControl({ value: item.title, disabled: item.title_editable == 1 ? false : true }, [Validators.required]),
          'value': new FormControl({ value: item.value, disabled: item.value_editable == 1 ? false : true }, [Validators.required]),
          'deletable': new FormControl(item.deletable, []),
        });
        entryControl.push(shFormGroup);
      });

      this._changeDetectorRef.detectChanges();
    }, (err: any) => {

    });
  }

  public saveSettings(index: number, operation: string) {
    let val  = this.systemSettings.getRawValue().entries[index];
    const url = operation == 'update' ? 'api/admin/system_settings/update/' + val.id : 'api/admin/system_settings/create';
    this._http.post(url, val).subscribe((data: any) => {
      this._toastr.showSuccess('Save Successfully');
      this.getSystemSettingsDetails();
    },
      (err: any) => {
        this._toastr.showError('Unable to save Setting');
      });
  }

  public forceLogoutAllUsers() {
    const url = 'api/users/forceLogoutAll';
    this._http.get(url).subscribe((data: any) => {
      this._toastr.showSuccess('All users logged out Successfully');
    },
      (err: any) => {
        this._toastr.showError('Error occured');
      });
  }



}
