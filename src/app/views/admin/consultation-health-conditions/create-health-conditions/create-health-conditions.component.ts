
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ConsultationHealthConditionsService } from '../consultation-health-conditions.service';
import { Helper } from 'src/app/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-create-health-conditions',
  templateUrl: './create-health-conditions.component.html'
})
export class CreateHealthConditionsComponent implements OnInit {
  public specialityPathList: any[]=[];
  public statesList: any[] = [];

  selectedFiles:File[]=[];
  selectedDocuments:File[]=[];
  selectedVideos:File[]=[];

  public imageUrl: any = '../../../../assets/img/no-image.png';
   addHealthConditionsForm: FormGroup;

  constructor(
    private _http: HttpClient,
    private router: Router,
    private _helper: Helper,
    private _changeDetectorRef:ChangeDetectorRef,
    private _consultationHealthtConditions: ConsultationHealthConditionsService) {

    this.addHealthConditionsForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'is_coming_soon':new FormControl(null, []),
      'specialities': new FormControl(null, [Validators.required]),
      'states': new FormControl(null, [Validators.required]),
      'price': new FormControl([], [Validators.required]),
      'is_offer': new FormControl(false, []),
      'offer_price': new FormControl(null,[]),
      'doctor_price': new FormControl([], [Validators.required]),
      'images':new FormArray([]),
      'documents':new FormArray([]),
      'videos':new FormArray([]),
      'faqs':new FormArray([]),
      'attributes':new FormArray([]),
    });

    let is_offerControl = this.addHealthConditionsForm.get('is_offer');
    if(is_offerControl){
        is_offerControl.valueChanges.subscribe((checked:boolean) => {
          if (checked) {
              const validators = [ Validators.required ];
              this.addHealthConditionsForm.addControl('offer_price', new FormControl(null, validators));
          }else{
              this.addHealthConditionsForm.patchValue({
                offer_price:null
              });
            this.addHealthConditionsForm.removeControl('offer_price');
          }
          this.addHealthConditionsForm.updateValueAndValidity();
        });
    }

    let is_activeControl = this.addHealthConditionsForm.get('is_active');
    if(is_activeControl){
      is_activeControl.valueChanges.subscribe((checked:boolean) => {
          if (checked) {
              this.addHealthConditionsForm.patchValue({
                is_coming_soon:false
              });
          }
        });
    }

    let is_coming_soonControl = this.addHealthConditionsForm.get('is_coming_soon');
    if(is_coming_soonControl){
      is_coming_soonControl.valueChanges.subscribe((checked:boolean) => {
          if (checked){
            this.addHealthConditionsForm.patchValue({
              is_active:false
            });
          }
      });
    }

    this.images().push(this.newFileInput(1));

  }

  get name() { return this.addHealthConditionsForm.get('name'); }
  get slug() { return this.addHealthConditionsForm.get('slug'); }
  get description() { return this.addHealthConditionsForm.get('description'); }
  get image_url() { return this.addHealthConditionsForm.get('image_url'); }
  get is_active() { return this.addHealthConditionsForm.get('is_active'); }
  get is_coming_soon() { return this.addHealthConditionsForm.get('is_coming_soon'); }
  get specialities() { return this.addHealthConditionsForm.get('specialities'); }
  get states() { return this.addHealthConditionsForm.get('states'); }
  get price() { return this.addHealthConditionsForm.get('price'); }
  get is_offer() { return this.addHealthConditionsForm.get('is_offer'); }
  get offer_price() { return this.addHealthConditionsForm.get('offer_price'); }
  get doctor_price() { return this.addHealthConditionsForm.get('doctor_price'); }

  ngOnInit() {
    this.getspecialityPathList();
    this.getStateList();
  }

  public getspecialityPathList() {
    const url = 'api/speciality_paths/all';
    this._http.get(url).subscribe((pets:any) => {
      this.specialityPathList = pets;
      this._changeDetectorRef.detectChanges();
    },(err:any) => {

    });
  }

/*----------------------------- IMAGES ------------------------------------*/
addFileInput(){
  this.images().push(this.newFileInput(null));
}

newFileInput(is_default:any): FormGroup {
  return new FormGroup({
    'image': new FormControl('', [Validators.required]),
    'caption': new FormControl('', []),
    'is_default': new FormControl(is_default, [])
  });
}

removeFileInput(empIndex:number) {
  this.images().removeAt(empIndex);
  this.selectedFiles.splice(empIndex,1);
}

images(): FormArray {
    return this.addHealthConditionsForm.get("images") as FormArray
}

onFileChange(index:number,event:any){
  const reader = new FileReader();
  if(event.target.files && event.target.files.length){
    const [file] = event.target.files;
    this.selectedFiles[index]=file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      // need to run CD since file load runs outside of zone
      this._changeDetectorRef.markForCheck();
    };
  }
}
/*-----------------------------END OF IMAGES --------------------------------*/


/*----------------------------- DOCUMENTS ------------------------------------*/
addDocumentInput(){
  this.documents().push(this.newDocumentInput());
}

newDocumentInput(): FormGroup {
  return new FormGroup({
    'document': new FormControl('', [Validators.required]),
    'caption': new FormControl('', [Validators.required])
  });
}

removeDocumentInput(empIndex:number) {
  this.documents().removeAt(empIndex);
  this.selectedDocuments.splice(empIndex,1);
}

onDocumentChange(index:number,event:any){
  const reader = new FileReader();
  if(event.target.files && event.target.files.length){
    const [file] = event.target.files;
    this.selectedDocuments[index]=file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      // need to run CD since file load runs outside of zone
      this._changeDetectorRef.markForCheck();
    };
  }
}

documents(): FormArray {
    return this.addHealthConditionsForm.get("documents") as FormArray
}
/*-----------------------------END OF DOCUMENTS --------------------------------*/

/*----------------------------- VIDEOS ------------------------------------*/
addVideoInput(){
  this.videos().push(this.newVideoInput());
}

newVideoInput(): FormGroup {
  return new FormGroup({
    'video': new FormControl('', [Validators.required])
  });
}

removeVideoInput(empIndex:number){
  this.videos().removeAt(empIndex);
  this.selectedVideos.splice(empIndex,1);
}

videos(): FormArray {
    return this.addHealthConditionsForm.get("videos") as FormArray
}

onVideoChange(index:number,event:any){
  const reader = new FileReader();
  if(event.target.files && event.target.files.length){
    const [file] = event.target.files;
    this.selectedVideos[index]=file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      // need to run CD since file load runs outside of zone
      this._changeDetectorRef.markForCheck();
    };
  }
}
/*-----------------------------END OF VIDEOS --------------------------------*/


/*-----------------------------FAQ --------------------------------*/
addFAQInput(){
  this.faqs().push(this.newFAQInput());
}

newFAQInput(): FormGroup {
  let length= this.faqs().length;
  return new FormGroup({
    'question': new FormControl('', [Validators.required]),
    'answer': new FormControl('', [Validators.required]),
    'sequence':new FormControl(length+1, []),
  });
}

removeFAQInput(empIndex:number) {
  this.faqs().removeAt(empIndex);
}

faqs(): FormArray {
    return this.addHealthConditionsForm.get("faqs") as FormArray
}
/*-----------------------------END OF FAQ --------------------------------*/


/*-----------------------------ATTRIBUTES --------------------------------*/
addAttributeInput(){
  this.attributes().push(this.newAttributeInput());
}

newAttributeInput(): FormGroup {
  let attr_length= this.attributes().length;
  return new FormGroup({
    'name': new FormControl('', [Validators.required]),
    'value': new FormControl('', [Validators.required]),
    'sequence':new FormControl(attr_length+1, []),
  });
}

removeAttributeInput(empIndex:number) {
  this.attributes().removeAt(empIndex);
}

attributes(): FormArray {
    return this.addHealthConditionsForm.get("attributes") as FormArray
}
/*-----------------------------END OF ATTRIBUTES --------------------------------*/



  async saveHealthConditions(formValid: boolean) {
    if (formValid) {
      const fd: FormData = new FormData();
      fd.append('condition', JSON.stringify(this.addHealthConditionsForm.value));
      if(this.selectedFiles.length>0){
        for(let file of this.selectedFiles){
          fd.append('images', file, file.name);
        }
      }
      if(this.selectedDocuments.length>0){
        for(let file of this.selectedDocuments){
          fd.append('documents', file, file.name);
        }
      }
      if(this.selectedVideos.length>0){
        for(let file of this.selectedVideos){
          fd.append('videos', file, file.name);
        }
      }
      let saved = await this._consultationHealthtConditions.createHealthConditions(fd);
      this.router.navigate(['admin','consultation-health-conditions','list']);
    } else {
      this._helper.markFormGroupTouched(this.addHealthConditionsForm);
      return;
    }
  }

  /* State List */
  get selectedState(){
    let statesControl = this.addHealthConditionsForm.get('states');
    let selLen = statesControl && statesControl.value ? statesControl.value.length:0;
    return selLen;
  }
  get notSelectedStates(){
    return this.statesList.length - this.selectedState;
  }

  public handleCheckAll(event: any, flag: any){
    if(flag == 'state'){
        if (event.checked) {
          let Allstates = this.statesList.map(({ _id }) => _id);
          this.addHealthConditionsForm.patchValue({ states: Allstates });
        } else {
          this.addHealthConditionsForm.patchValue({ states: [] });
        }
      }
  }

  public getStateList() {
    this._http.get('api/system_states/all').subscribe((data:any) => {
        this.statesList = data;
      }, err => {

      });
  }
}
