import { Component, OnInit, ChangeDetectorRef, ElementRef, Inject, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environment';

import { COMMA,ENTER } from '@angular/cdk/keycodes';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, tap, filter, switchMap, takeUntil } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NcpdpDrugFormsComponent } from '../../ncpdp-drug-forms/ncpdp-drug-forms.component';
import { NcpdpDrugFormsService } from '../../ncpdp-drug-forms/ncpdp-drug-forms.service';
import { TextEditorModalComponent } from '../../common-components/text-editor-modal/text-editor-modal.component';
import { TextEditorModalService } from '../../common-components/text-editor-modal/text-editor-modal.service';

@Component({
  selector: 'app-edit-medicine-kits',
  templateUrl: './edit-medicine-kits.component.html',
  styleUrls: ['./edit-medicine-kits.component.scss']
})
export class EditMedicineKitsComponent implements OnInit,OnDestroy {
  pdfIcon: string = '../../../../../assets/img/pdf_file_icon.png'
  videoIcon: string = '../../../../../assets/img/video-play-icon.png'
  medicineKitId:any;
  medicineKitDetails:any;
  public statesList:any[]=[];
  public treatmentConditionList:any[]=[];

  public addMedicineKit: FormGroup;
  public medicineError: boolean = false;
  public oneImageRequired: boolean = false;
  modalRef!: BsModalRef;
  dispenseUnits:any[]=[];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  elementTypes=['DESCRIPTION','LIST','TABLE','HTML'];
  routes=[
    'Oral','Sublingual / Buccal','Rectal','Topical','Inhalation','Transdermal','Injection'
  ];

  protected brands: any[] = [];
  public brandFilteringCtrl: FormControl = new FormControl();
  public searchingBrand = false;
  public filteredBrands: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyBrand = new Subject<void>();

  public manufacturerFilteringCtrl: FormControl = new FormControl();
  public searching = false;
  public filteredManufacturers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyManufacturer = new Subject<void>();

   /* Similar Drugs */
  searchingDrug:boolean=false;
  SimilarDrugsCtrl = new FormControl();
  filteredSimilarDrugs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSimilarDrugsValues: any[] = [];
  selectedSimilarDrugs: any[] = [];
  @ViewChild('similarDrugsInput') similarDrugsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autoSimilarDrug') matAutocompleteSimilarDrug!: MatAutocomplete;
  protected _onDestroy = new Subject<void>();

  selectedFiles:File[]=[];
  selectedDocuments:File[]=[];
  selectedVideos:File[]=[];

  constructor(
    public http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private ncpdpDrugFormsService:NcpdpDrugFormsService,
    private _textEditorModalService: TextEditorModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _helper:Helper,
    private _toastr: Toastr){

    let activatedRoute:any  = this._route;
    this.medicineKitId = activatedRoute.parent.snapshot.paramMap.get('kit_id');

    this.addMedicineKit = new FormGroup({
      'treatment_condition_ids': new FormControl([], []),
      'name': new FormControl('', [Validators.required]),
      'generic_name': new FormControl('', []),
      'brand_id':new FormControl('', []),
      'manufacturer_id':new FormControl(null,[]),
      'description': new FormControl('', []),
      'is_active': new FormControl(true, []),
      'is_coming_soon': new FormControl(false, []),
      'states':new FormControl([], [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      'pharmacy_price': new FormControl('', [Validators.required]),
      'is_offer': new FormControl(false, []),
      'offer_price': new FormControl('',[]),
      'doctor_price': new FormControl([], [Validators.required]),
      'tab_name': new FormControl('', [Validators.required]),
      'tab_url': new FormControl('', [Validators.required]),
      'is_auto_refill': new FormControl(true, [Validators.required]),
      'default_refill': new FormControl('', [Validators.required]),
      'refill_frequency': new FormControl('', [Validators.required]),
      'images':new FormArray([]),
      'documents':new FormArray([]),
      'videos':new FormArray([]),
      'faqs':new FormArray([]),
      'attributes':new FormArray([]),
      'icd10_code': new FormControl([]),
      'custom_icd10_codes':new FormArray([]),
      'medicines':new FormArray([])
    });


    this.manufacturerFilteringCtrl.valueChanges
    .pipe(
      filter(search => !!search),
      tap(() => this.searching = true),
      takeUntil(this._onDestroyManufacturer),
      switchMap((search:any) => {
        return this.filterManufacturesResults(search);
      }),
      takeUntil(this._onDestroyManufacturer)
    )
    .subscribe((filteredBanks:any) => {
      this.searching = false;
      this.filteredManufacturers.next(filteredBanks);
    },
      error => {
        // no errors in our simulated example
        this.searching = false;
        // handle error...
      });


    this.brandFilteringCtrl.valueChanges
    .pipe(
      filter(search => !!search),
      tap(() => this.searchingBrand = true),
      takeUntil(this._onDestroyBrand),
      switchMap((search:any) => {
        return this.filterBrandsResults(search);
      }),
      takeUntil(this._onDestroyBrand)
    )
    .subscribe((filteredBanks:any) => {
      this.searchingBrand = false;
      this.filteredBrands.next(filteredBanks);
    },
      error => {
        // no errors in our simulated example
        this.searchingBrand = false;
        // handle error...
      });


      // listen for search field value changes
      this.SimilarDrugsCtrl.valueChanges
      .pipe(
        filter((search:any) => !!search),
        tap(() => this.searchingDrug = true),
        takeUntil(this._onDestroy),
        debounceTime(100),
        //distinctUntilChanged(),
        switchMap((search:any) => {
          if(search.length>0){
            return this.http.get<any>(`api/search/icd10?search=${search}`);
          }else{
            return [];
          }
        }),
        delay(300),
        takeUntil(this._onDestroy)
        )
        .subscribe((filtered:any) => {
          let filteredData = filtered && filtered[3]?filtered[3]:[];
          this.searchingDrug = false;
          this.filteredSimilarDrugs.next(filteredData);
          this.filteredSimilarDrugsValues=filteredData;
        },
        (error:any) => {
          // no errors in our simulated example
          this.searchingDrug = false;
          // handle error...
      });

    let is_offer_control=this.addMedicineKit.get('is_offer');
    let is_coming_soon_control = this.addMedicineKit.get('is_coming_soon');
    let is_active_control = this.addMedicineKit.get('is_active');

    if(is_offer_control){
      is_offer_control.valueChanges.subscribe((checked:boolean) => {
        if (checked) {
            const validators = [ Validators.required ];
            this.addMedicineKit.addControl('offer_price', new FormControl(null, validators));
        }else{
          this.addMedicineKit.patchValue({
            offer_price:null
          });
          this.addMedicineKit.removeControl('offer_price');
        }
        this.addMedicineKit.updateValueAndValidity();
      });
    }

    if(is_coming_soon_control){
      is_coming_soon_control.valueChanges.subscribe((checked:boolean) => {
        if (checked) {
            this.addMedicineKit.patchValue({
              is_active:false
            });
        }
      });
    }

    if(is_active_control){
      is_active_control.valueChanges.subscribe((checked:boolean) => {
        if (checked) {
            this.addMedicineKit.patchValue({
              is_coming_soon:false
            });
        }
      });
    }
  }

/*----------------------------- IMAGES ------------------------------------*/
  addFileInput(){
    this.images().push(this.newFileInput(false));
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
      return this.addMedicineKit.get("images") as FormArray
  }

  onFileChange(index:number,event:any){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      this.selectedFiles[index]=file;
      reader.readAsDataURL(file);
      reader.onload = () => {
        // need to run CD since file load runs outside of zone
        this.changeDetectorRef.markForCheck();
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
        this.changeDetectorRef.markForCheck();
      };
    }
  }

  documents(): FormArray {
      return this.addMedicineKit.get("documents") as FormArray
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
      return this.addMedicineKit.get("videos") as FormArray
  }

  onVideoChange(index:number,event:any){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      this.selectedVideos[index]=file;
      reader.readAsDataURL(file);
      reader.onload = () => {
        // need to run CD since file load runs outside of zone
        this.changeDetectorRef.markForCheck();
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
      return this.addMedicineKit.get("faqs") as FormArray
  }
  /*-----------------------------END OF FAQ --------------------------------*/



/*-----------------------------ATTRIBUTES --------------------------------*/
addAttributeInput(){
  this.attributes().push(this.newAttributeInput());
}

newAttributeInput(): FormGroup {
  let attr_length= this.attributes().length;
  return new FormGroup({
    'type': new FormControl('', [Validators.required]),
    'key': new FormControl('', [Validators.required]),
    'value': new FormControl(null, []),
    'value_html': new FormControl(null, []),
    'list': new FormArray([]),
    'table': new FormArray([]),
    'sequence':new FormControl(attr_length+1, []),
  });
}

newListItemInput(): FormGroup {
  return new FormGroup({
    'name': new FormControl('', [Validators.required]),
  });
}

removeAttributeInput(empIndex:number) {
  this.attributes().removeAt(empIndex);
}

attributes(): FormArray {
    return this.addMedicineKit.get("attributes") as FormArray
}

/*-------------------LIST ------------------------*/
addAttributeListInput(attributeIndex:number){
  this.attributesList(attributeIndex).push(this.newListItemInput());
}

removeAttributeListInput(attributeIndex:number,itemIndex:number) {
  this.attributesList(attributeIndex).removeAt(itemIndex);
}

attributesList(attributeIndex:number): FormArray {
    return this.attributes().at(attributeIndex).get("list") as FormArray
}

attributesListControls(attributeIndex:number){
  return (this.attributes().at(attributeIndex).get("list") as FormArray).controls;
}

/*-------------------TABLE -----------------------*/
newTableItemInput(): FormGroup {
  return new FormGroup({
    'label': new FormControl('', [Validators.required]),
    'value': new FormControl('', [Validators.required]),
  });
}

addAttributeTableInput(attributeIndex:number){
  this.attributesTable(attributeIndex).push(this.newTableItemInput());
}

removeAttributeTableInput(attributeIndex:number,itemIndex:number) {
  this.attributesTable(attributeIndex).removeAt(itemIndex);
}

attributesTable(attributeIndex:number): FormArray {
    return this.attributes().at(attributeIndex).get("table") as FormArray
}

attributesTableControls(attributeIndex:number){
  return (this.attributes().at(attributeIndex).get("table") as FormArray).controls;
}

handleTypeChange(attributeIndex:number,event:any){
  let value = event.target.value;
  let htmlControl=this.attributes().at(attributeIndex).get('value_html');
  let valueControl=this.attributes().at(attributeIndex).get('value');

  if(value=='LIST'){
      htmlControl ? htmlControl.clearValidators():'';
      valueControl ? valueControl.clearValidators():'';

      this.addAttributeListInput(attributeIndex);
      this.attributesTable(attributeIndex).clear();
  }
  else if(value=='TABLE'){
    htmlControl ? htmlControl.clearValidators():'';
    valueControl ? valueControl.clearValidators():'';

    this.attributesList(attributeIndex).clear();
    this.addAttributeTableInput(attributeIndex);
  }
  else if(value=='HTML'){
     valueControl ? valueControl.clearValidators():'';

    if(htmlControl){
      htmlControl.setValidators([Validators.required]);
      htmlControl.updateValueAndValidity();
    }
    this.attributesList(attributeIndex).clear();
    this.attributesTable(attributeIndex).clear();
  }
  else{
      if(valueControl){
        valueControl.setValidators([Validators.required]);
        valueControl.updateValueAndValidity();
      }
      htmlControl ? htmlControl.clearValidators():'';
      this.attributesList(attributeIndex).clear();
      this.attributesTable(attributeIndex).clear();
  }
}

/*-----------------------------END OF ATTRIBUTES --------------------------------*/



  get name() { return this.addMedicineKit.get('name'); }
  get treatment_condition_ids() { return this.addMedicineKit.get('treatment_condition_ids'); }
  get generic_name() { return this.addMedicineKit.get('generic_name'); }
  get manufacturer_id(){return this.addMedicineKit.get('manufacturer_id');}
  get brand_id() { return this.addMedicineKit.get('brand_id'); }
  get description(){return this.addMedicineKit.get('description');}
  get price() { return this.addMedicineKit.get('price'); }
  get pharmacy_price() { return this.addMedicineKit.get('pharmacy_price'); }
  get tab_name() { return this.addMedicineKit.get('tab_name'); }
  get tab_url() { return this.addMedicineKit.get('tab_url'); }
  get is_active() { return this.addMedicineKit.get('is_active'); }
  get is_coming_soon(){return this.addMedicineKit.get('is_coming_soon');}
  get is_auto_refill(){return this.addMedicineKit.get('is_auto_refill');}
  get default_refill() { return this.addMedicineKit.get('default_refill'); }
  get refill_frequency() { return this.addMedicineKit.get('refill_frequency'); }
  get states(){return this.addMedicineKit.get('states');}
  get is_offer() { return this.addMedicineKit.get('is_offer'); }
  get offer_price() { return this.addMedicineKit.get('offer_price'); }
  get doctor_price() { return this.addMedicineKit.get('doctor_price'); }
  get icd10_code(){return this.addMedicineKit.get('icd10_code')}

  ngOnInit() {
    this.getStateList();
    this.getTreatmentConditionList();
    this.getMedicineKitDetails();
  }

  ngOnDestroy(){
    this._onDestroyBrand.next();
    this._onDestroyBrand.complete();

    this._onDestroyManufacturer.next();
    this._onDestroyManufacturer.complete();

    this._onDestroy.next();
    this._onDestroy.complete();
  }

   /*--- Similar Drug Helpers ---*/
   addSimilarDrug(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {}
    // Reset the input value
    if (input) { input.value = ''; }
    this.SimilarDrugsCtrl.setValue(null);
  }

  removeSimilarDrug(drug: any): void {
    const index = this.selectedSimilarDrugs.findIndex((item:any)=>item.id == drug.id);
    if (index !=-1) {
      this.selectedSimilarDrugs.splice(index, 1);
    }
  }

  selectedSimilarDrug(event: MatAutocompleteSelectedEvent): void {
    let itemFound = this.filteredSimilarDrugsValues.find((item:any)=>item[0]==event.option.value.split('___')[0]);
    if(itemFound){
      this.selectedSimilarDrugs.push(itemFound);
    }
    this.similarDrugsInput.nativeElement.value = '';
    this.SimilarDrugsCtrl.setValue(null);
  }
  /*---End of Similar Drug Helpers ---*/

  getMedicineKitDetails() {
    const url = 'api/medicine_kits/view/' + this.medicineKitId;
    this.http.get(url).subscribe((res: any) => {
        this.medicineKitDetails = res;

        if(res.brand_id){
          this.filteredBrands.next([
            res.brand_id
          ]);
        }

        if(res.manufacturer_id){
          this.filteredManufacturers.next([
            res.manufacturer_id
          ]);
        }


        this.addMedicineKit.patchValue({
          'treatment_condition_ids': res.treatment_condition_ids.map((item:any)=>item._id),
          'name': res.name,
          'generic_name': res.generic_name,
          'manufacturer_id':res.manufacturer_id ? res.manufacturer_id._id:null,
          'brand_id':res.brand_id ? res.brand_id._id:null,
          'description':res.description,
          'is_active':res.is_active,
          'is_coming_soon':res.is_coming_soon,
          'states': res.states.map((item:any)=>item._id),
          'price': res.price,
          'pharmacy_price': res.pharmacy_price,
          'is_offer': res.is_offer,
          'offer_price': res.offer_price,
          'doctor_price': res.doctor_price,
          'tab_name': res.tab_name,
          'tab_url': res.tab_url,
          'is_auto_refill': res.is_auto_refill,
          'default_refill': res.default_refill,
          'refill_frequency':res.refill_frequency
        });

        const icd10CodeControl = this.addMedicineKit.get('custom_icd10_codes') as FormArray;
        res.icd10_codes.forEach((item:any)=>{
          let icd10FormGroup = new FormGroup({
            'code':new FormControl(item.code, [Validators.required]),
            'description':new FormControl(item.description)
          });
          icd10CodeControl.push(icd10FormGroup);
        });

        const faqsControl = this.addMedicineKit.get('faqs') as FormArray;
        res.faqs.forEach((item:any)=>{
          let faqFormGroup = new FormGroup({
            'question':new FormControl(item.question, [Validators.required]),
            'answer':new FormControl(item.answer, [Validators.required]),
            'sequence':new FormControl(item.sequence)
          });
          faqsControl.push(faqFormGroup);
        });

        const attributesControl = this.addMedicineKit.get('attributes') as FormArray;
        res.attributes.forEach((item:any)=>{

          let listControlFormArray:any[]=[];
          let tableControlFormArray:any[]=[];

          if(item.type=='LIST'){
            for(let listItem of item.list){
              let listControl:any = new FormGroup({
                'name': new FormControl(listItem.name, [Validators.required]),
              });
              listControlFormArray.push(listControl);
            }
          }

          if(item.type=='TABLE'){
            for(let tableItem of item.table){
              let tableControl:any = new FormGroup({
                'label': new FormControl(tableItem.label, [Validators.required]),
                'value': new FormControl(tableItem.value, [Validators.required])
              });
              tableControlFormArray.push(tableControl);
            }
          }

          let attrFormGroup = new FormGroup({
            'type': new FormControl(item.type, [Validators.required]),
            'key': new FormControl(item.key, [Validators.required]),
            'value': new FormControl(item.value, []),
            'value_html': new FormControl(item.value_html, []),
            'list': new FormArray(listControlFormArray),
            'table': new FormArray(tableControlFormArray),
            'sequence':new FormControl(item.sequence, []),
          });
          attributesControl.push(attrFormGroup);
        });


        const medicinesControl = this.addMedicineKit.get('medicines') as FormArray;
        res.medicines.forEach((item:any)=>{
          let medFormGroup = new FormGroup({
            'name': new FormControl(item.name, [Validators.required]),
            'quantity': new FormControl(item.quantity, [Validators.required]),
            'quantity_unit': new FormControl(item.quantity_unit, [Validators.required]),
            'ndc_number': new FormControl(item.ndc_number, []),
            'default_direction': new FormControl(item.default_direction, [Validators.required, Validators.maxLength(140)]),
            'rxcui': new FormControl(item.rxcui, []),
            'strength':new FormControl(item.strength, [Validators.required]),
            'is_shippable': new FormControl(item.is_shippable, []),
            'shipping_weight': new FormControl(item.shipping_weight, []),
            'shipping_weight_unit': new FormControl(item.shipping_weight_unit, []),
            'doseform':new FormControl(item.doseform,[]),
            'ncpdp_unit_code':new FormControl(item.ncpdp_unit_code,[Validators.required]),
            'days_supply': new FormControl(item.days_supply,[Validators.required]),
            'route':new FormControl(item.route, []),
            'is_active': new FormControl(item.is_active, []),
            'substitutions': new FormControl(item.substitutions,[Validators.required])
          });
          medicinesControl.push(medFormGroup);
        });



      },(err:any) => {

      });
  }

  public getStateList() {
    this.http.get('api/system_states/all').subscribe((data:any) => {
        this.statesList = data;
      },(err:any) => {

      });
  }

  async filterManufacturesResults(token: string) {
    return this.getAllManufacturers(token).then((data:any)=>{
      return data;
    });
  }

  async getAllManufacturers(searchTerm:string):Promise<any>{
    return await this.http.get(`api/manufacturers/all`+`?search=${searchTerm}`).toPromise();
  }

  async filterBrandsResults(token: string) {
    return this.getAllBrands(token).then((data:any)=>{
      return data;
    });
  }

  async getAllBrands(searchTerm:string):Promise<any>{
    let manufacturer_id_control = this.addMedicineKit.get('manufacturer_id');
    let manufacturer_id = manufacturer_id_control ? manufacturer_id_control.value : '';
    return await this.http.get(`api/brands/all`+`?search=${searchTerm}&manufacturer_id=${manufacturer_id}`).toPromise();
  }

  get selectedState(){
    let states = this.addMedicineKit.get('states');
    let selLen = states && states.value? states.value.length:0;
    return selLen;
  }

  get notSelectedStates(){
    return this.statesList.length - this.selectedState;
  }

  get custom_icd10_codesGroup():FormGroup {
    return new FormGroup({
      'code':new FormControl(null, [Validators.required]),
      'description':new FormControl(null, [])
    });
  }

  public addNewCustomICD10Code(){
    const ICD10CodeControl = this.addMedicineKit.get('custom_icd10_codes') as FormArray;
    ICD10CodeControl.push(this.custom_icd10_codesGroup);
  }

  public custom_icd10_codesControls(){
    return (this.addMedicineKit.get('custom_icd10_codes') as FormArray)['controls'];
  }

  public removeCustomICD10Code(index:number){
    const ICD10CodeControl = this.addMedicineKit.get('custom_icd10_codes') as FormArray;
    ICD10CodeControl.removeAt(index);
  }

  get medicinesGrup(): FormGroup {
    return new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'quantity': new FormControl(null, [Validators.required]),
      'quantity_unit': new FormControl(null, [Validators.required]),
      'ndc_number': new FormControl(null, []),
      'default_direction': new FormControl(null, [Validators.required, Validators.maxLength(140)]),
      'rxcui': new FormControl(null, []),
      'strength':new FormControl(null, [Validators.required]),
      'is_shippable': new FormControl(false, []),
      'shipping_weight': new FormControl(null, []),
      'shipping_weight_unit': new FormControl(null, []),
      'doseform':new FormControl(null,[]),
      'ncpdp_unit_code':new FormControl(null,[Validators.required]),
      'days_supply': new FormControl(null,[Validators.required]),
      'route':new FormControl(null, []),
      'is_active': new FormControl(true, []),
      'substitutions': new FormControl(false,[Validators.required])
    });
  }

  public addNewMedicine() {
    const medicinesControl = this.addMedicineKit.get('medicines') as FormArray;
    medicinesControl.push(this.medicinesGrup);
    this.hasMedicineLengthError();
  }

  public medicinesControls(){
    return (this.addMedicineKit.get('medicines') as FormArray)['controls'];
  }

  public removeMedicine(index: any) {
    const medicinesControl = this.addMedicineKit.get('medicines') as FormArray;
    medicinesControl.removeAt(index);
    this.hasMedicineLengthError();
  }

  public hasMedicineLengthError() {
    const licenseControl = this.addMedicineKit.get('medicines') as FormArray;
    if (licenseControl.length < 1) {
      this.medicineError = true;
    } else {
      this.medicineError = false;
    }
    return this.medicineError;
  }

  public handleCheckAll (event:any, flag:any) {
    if (flag == 'state') {
      if (event.checked) {
        let Allstates = this.statesList.map(({_id}) => _id);
        this.addMedicineKit.patchValue({states:Allstates});
      } else {
        this.addMedicineKit.patchValue({states:[]});
      }
    }
  }

  public getTreatmentConditionList() {
    const url = 'api/treatment_conditions/all';
    this.http.get(url).subscribe((listData:any) => {
      this.treatmentConditionList = listData;
      this.changeDetectorRef.detectChanges();
    },(err:any) => {

    });
  }

  public saveMedicineKit(){
    if (this.addMedicineKit.invalid){
      this._helper.markFormGroupTouched(this.addMedicineKit);
      return;
    }
    const fd: FormData = new FormData();

    let icd10Obj: any = []
    for (let item of this.selectedSimilarDrugs) {
      icd10Obj.push({
        code: item[0],
        description: item[1]
      })
    }
    this.addMedicineKit.value.icd10_code = icd10Obj;
    this.addMedicineKit.value.oldImages = this.medicineKitDetails.images;
    this.addMedicineKit.value.oldDocuments = this.medicineKitDetails.documents;
    this.addMedicineKit.value.oldVideos = this.medicineKitDetails.videos;

    fd.append('medicinekit', JSON.stringify(this.addMedicineKit.value));
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
    const url = `api/medicine_kits/update/${this.medicineKitId}`;
    const req = fd;
    this.http.post(url, req).subscribe(
      (data: any) => {

            this._router.navigate(['/admin/medicine-kits/list'],{ replaceUrl: true });
            this._toastr.showSuccess('Update Successfully');

      },
      (err:any) => {
        this._toastr.showError('Unable to update medicine kit.');
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  public NCITCodeSearch(index:number){
    this.ncpdpDrugFormsService.setFormData({index:index});
    this.modalRef = this.modalService.show(NcpdpDrugFormsComponent,{class: 'modal-lg'});
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.selectedDrug.subscribe((receivedEntry:any) => {
      let controls = this.addMedicineKit.get('medicines') as FormArray;
      controls.at(index).patchValue({
        ncpdp_unit_code:receivedEntry.ncit_code,
        doseform:receivedEntry.ncpdp_preferred_term
      });
      this.modalRef.hide();
    });
  }

  handleSelectionChange(event:any){
     let findObj=  this.dispenseUnits.find((item:any)=>item.StandardDispenseUnitTypeID==event.value);
     if(findObj){
        this.addMedicineKit.patchValue({
          ncpdp_unit_code:findObj.PotencyUnitCode,
          doseform:findObj.Name
        });
     }
  }

  findDispenseUnitByNCPDPForm(ncpdp_form:string){
    let findObj=  this.dispenseUnits.find((item:any)=>item.PotencyUnitCode==ncpdp_form);
    if(findObj){
       this.addMedicineKit.patchValue({
        dispense_unit_id:findObj.StandardDispenseUnitTypeID,
         doseform:findObj.Name
       });
    }
  }

  defaultImageChange (imgId: any, event: any) {
    this.medicineKitDetails.images.map((img: any) => {
      if(img._id == imgId) {
        img.is_default = event.target.checked
      } else {
        img.is_default = !event.target.checked
      }
    })
  }

  deleteImage(img: any){
    let defaultImagesLength: number = this.medicineKitDetails.images.filter((img: any) => img.is_default).length + this.addMedicineKit.value.images.filter((img: any) => img.is_default).length
    if (defaultImagesLength > 0) {
      let index: number = this.medicineKitDetails.images.findIndex((data: any) => data._id === img._id);
      if(index != -1) {
        this.medicineKitDetails.images.splice(index, 1);
      }
    }
  }
  deleteDocument(doc: any){
    let index: number = this.medicineKitDetails.documents.findIndex((data: any) => data._id === doc._id);
    if(index != -1) {
      this.medicineKitDetails.documents.splice(index, 1);
    }
  }
  deleteVideo(video: any){
    let index: number = this.medicineKitDetails.videos.findIndex((data: any) => data._id === video._id);
    if(index != -1) {
      this.medicineKitDetails.videos.splice(index, 1);
    }
  }

  getUrl(url: string) {
    return environment.api_url + url
  }

  openHTMLEditorModal(formIndex: number){
    this._textEditorModalService.setFormData(this.attributes().at(formIndex).value.value_html);
    this.modalRef = this.modalService.show(TextEditorModalComponent, {class: 'modal-full-lg', backdrop : 'static', keyboard : false});
    this.modalRef.content.onEventCompleted.subscribe((receivedHTML:any) => {
      this.attributes().at(formIndex).patchValue({
        value_html: receivedHTML
      })
      this.modalRef.hide();
    });
  }
}
