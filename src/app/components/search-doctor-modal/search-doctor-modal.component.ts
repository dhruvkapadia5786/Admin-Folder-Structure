import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl,FormArray, Validators,FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/services/helper.service';
import { SearchDoctorModalService } from './search-doctor-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-doctor-modal',
  templateUrl: './search-doctor-modal.component.html',
  styleUrls: ['./search-doctor-modal.component.scss']
})
export class SearchDoctorModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  @Output() onSearchDoctorModalClosed: EventEmitter<any> = new EventEmitter();

  public query!: any
  public doctorFormGroup: FormGroup;
  public doctorSearchResults:any[] =[];
  states!: Array<any>;

  constructor(
    private _http: HttpClient,
    private _helper:Helper,
    private _bsModalRef: BsModalRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _searchDoctorModalService: SearchDoctorModalService
  ) {
    this.doctorFormGroup = new FormGroup({
      'firstName': new FormControl(null, [Validators.required]),
      'lastName': new FormControl(null, []),
      'clinicName': new FormControl(null, []),
      'cityName': new FormControl(null, []),
      'stateName': new FormControl(null, []),
      'zipCode': new FormControl(null, [])
    });
  }

  get firstName() { return this.doctorFormGroup.get('firstName'); }
  get lastName() { return this.doctorFormGroup.get('lastName'); }
  get clinicName() { return this.doctorFormGroup.get('clinicName'); }
  get cityName() { return this.doctorFormGroup.get('cityName'); }
  get stateName() { return this.doctorFormGroup.get('stateName'); }
  get zipCode() { return this.doctorFormGroup.get('zipCode'); }

  ngOnInit(): void {
    this.getStates();
  }

  getStates(){
    const url = 'api/v1/address/us_states';
    this._http.get(url).subscribe((data:any) => {
      this.states = data;
    },
    (err) => {});
  }

  onDoctorSubmit(form: any): boolean|void {
    if (form.valid) {
      let { firstName, lastName, clinicName, cityName, stateName, zipCode } = form.value; // this.doctorFormGroup.value;
      let apiURL = `api/v1/search/doctor?firstName=${firstName}`;
      lastName ? apiURL += `&lastName=${lastName}` : apiURL;
      clinicName ? apiURL += `&clinicName=${clinicName}` : apiURL;
      cityName ? apiURL += `&cityName=${cityName}` : apiURL;
      stateName ? apiURL += `&stateName=${stateName}` : apiURL;
      zipCode ? apiURL += `&zipCode=${zipCode}` : apiURL;

      this._http.get(apiURL).subscribe((data: any) => {
          this.doctorSearchResults = data.results;
        }, err => {

      });
      this._changeDetectorRef.detectChanges();
    } else {
      this._helper.markFormGroupTouched(this.doctorFormGroup);
      window.scrollTo(0, 0);
      return false;
    }
  }

  onSelectDoctorclick(doctor: any){
    this.onEventCompleted.emit(doctor);
    this.onSearchDoctorModalClosed.emit(true);
  }

  closeModal(){
    this.onSearchDoctorModalClosed.emit(true);
    //this._bsModalRef.hide();
  }
}
