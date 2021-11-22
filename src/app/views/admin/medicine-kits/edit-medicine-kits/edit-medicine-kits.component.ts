import { Component, OnInit, ChangeDetectorRef,ElementRef ,Inject,ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-edit-medicine-kits',
  templateUrl: './edit-medicine-kits.component.html',
  styleUrls: ['./edit-medicine-kits.component.scss']
})
export class EditMedicineKitsComponent implements OnInit {
  pdfIcon: string = '../../../../../assets/img/pdf_file_icon.png'
  videoIcon: string = '../../../../../assets/img/video-play-icon.png'
  medicineKitId:any;
  medicineKitDetails:any;
  public petTypeList: any[]=[];
  public brandsList: any[]=[];
  public statesList:any[]=[];
  public drugTypesList:any[]=[];
  public productFormsList:any[]=[];

  public breedsList:any[]=[];
  public breedSizeList:any[]=[];
  public lifeStageList:any[]=[];
  public healthConditionsList:any[]=[];
  public shopCategoriesList:any[]=[];

  public addMedicineKit: FormGroup;
  public medicineError: boolean = false;
  public oneImageRequired: boolean = false;
  modalRef!: BsModalRef;
  dispenseUnits:any[]=[];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

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
    private _router: Router,
    private _route: ActivatedRoute,
    private _helper:Helper,
    private _toastr: Toastr){

    let activatedRoute:any  = this._route;
    this.medicineKitId = activatedRoute.parent.snapshot.paramMap.get('kit_id');

    this.addMedicineKit = new FormGroup({
      'drug_type': new FormControl('', []),
      'product_form':new FormControl('', [Validators.required]),
      'name': new FormControl('', [Validators.required]),
      'generic_name': new FormControl('', []),
      'brand_id':new FormControl('', [Validators.required]),
      'pet_type':new FormControl('', [Validators.required]),
      'min_weight':new FormControl('', []),
      'max_weight':new FormControl('', []),
      'shop_categories':new FormControl([], []),
      'breeds':new FormControl([], []),
      'health_conditions':new FormControl([], []),
      'breed_size':new FormControl([], []),
      'lifestage':new FormControl([], []),
      'description': new FormControl('', []),
      'is_active': new FormControl(true, []),
      'is_coming_soon': new FormControl(false, []),
      'states':new FormControl([], [Validators.required]),
      'max_order_quantity': new FormControl(50, [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      'pharmacy_price': new FormControl('', [Validators.required]),
      'is_offer': new FormControl(false, []),
      'offer_price': new FormControl('',[]),
      'doctor_price': new FormControl([], [Validators.required]),
      'ndc_number': new FormControl('',[]),
      'dispense_unit_id': new FormControl('',[Validators.required]),
      'quantity':new FormControl('',[Validators.required]),
      'strength':new FormControl('',[Validators.required]),
      'shipping_weight':new FormControl('',[Validators.required]),
      'doseform':new FormControl('',[Validators.required]),
      'ncpdp_unit_code':new FormControl('',[Validators.required]),
      'default_direction':new FormControl('',[]),
      'days_supply':new FormControl('', [Validators.required]),
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
      'custom_icd10_codes':new FormArray([])
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
      'name': new FormControl('', [Validators.required]),
      'value': new FormControl('', [Validators.required]),
      'sequence':new FormControl(attr_length+1, []),
    });
  }

  removeAttributeInput(empIndex:number) {
    this.attributes().removeAt(empIndex);
  }

  attributes(): FormArray {
      return this.addMedicineKit.get("attributes") as FormArray
  }
  /*-----------------------------END OF ATTRIBUTES --------------------------------*/



  get name() { return this.addMedicineKit.get('name'); }
  get drug_type() { return this.addMedicineKit.get('drug_type'); }
  get product_form() { return this.addMedicineKit.get('product_form'); }

  get generic_name() { return this.addMedicineKit.get('generic_name'); }
  get brand_id() { return this.addMedicineKit.get('brand_id'); }
  get pet_type() { return this.addMedicineKit.get('pet_type'); }
  get min_weight() { return this.addMedicineKit.get('min_weight'); }
  get max_weight() { return this.addMedicineKit.get('max_weight'); }
  get breeds() { return this.addMedicineKit.get('breeds'); }
  get shop_categories(){ return this.addMedicineKit.get('shop_categories'); }
  get health_conditions(){return this.addMedicineKit.get('health_conditions');}
  get breed_size() { return this.addMedicineKit.get('breed_size'); }
  get lifestage() { return this.addMedicineKit.get('lifestage'); }
  get description(){return this.addMedicineKit.get('description');}
  get max_order_quantity(){return this.addMedicineKit.get('max_order_quantity');}
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

  get ndc_number() { return this.addMedicineKit.get('ndc_number'); }
  get dispense_unit_id() { return this.addMedicineKit.get('dispense_unit_id'); }
  get quantity() { return this.addMedicineKit.get('quantity'); }
  get strength() { return this.addMedicineKit.get('strength'); }
  get shipping_weight() { return this.addMedicineKit.get('shipping_weight'); }
  get doseform() { return this.addMedicineKit.get('doseform'); }
  get ncpdp_unit_code() { return this.addMedicineKit.get('ncpdp_unit_code'); }
  get default_direction() { return this.addMedicineKit.get('default_direction'); }
  get days_supply() { return this.addMedicineKit.get('days_supply'); }

  get icd10_code(){return this.addMedicineKit.get('icd10_code')}

  ngOnInit() {
    this.getStateList();
    this.getBrandsList();
    this.getPetTypeList();
    this.getDrugTypeList();
    this.getProductFormsList();
    this.getDoesspotDispenseUnits();
    this.getMedicineKitDetails();
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
        this.getPetDetails(res.pet_type._id);

        this.addMedicineKit.patchValue({
          'drug_type': res.drug_type._id,
          'product_form':res.product_form._id,
          'name': res.name,
          'generic_name': res.generic_name,
          'brand_id':res.brand_id._id,
          'pet_type':res.pet_type._id,
          'min_weight':res.min_weight,
          'max_weight':res.max_weight,
          'shop_categories':res.shop_categories,
          'breeds': res.breeds.map((itm: any) => itm.id),
          'health_conditions': res.health_conditions,
          'breed_size':res.breed_size.map((itm: any) => itm.size),
          'lifestage':res.lifestage,
          'description':res.description,
          'is_active':res.is_active,
          'is_coming_soon':res.is_coming_soon,
          'states': res.states,
          'max_order_quantity':res.max_order_quantity,
          'price': res.price,
          'pharmacy_price': res.pharmacy_price,
          'is_offer': res.is_offer,
          'offer_price': res.offer_price,
          'doctor_price': res.doctor_price,
          'ndc_number': res.ndc_number,
          'dispense_unit_id': res.dispense_unit_id,
          'quantity':res.quantity,
          'strength':res.strength,
          'shipping_weight':res.shipping_weight,
          'doseform':res.doseform,
          'ncpdp_unit_code':res.ncpdp_unit_code,
          'default_direction':res.default_direction,
          'days_supply':res.days_supply,
          'tab_name': res.tab_name,
          'tab_url': res.tab_url,
          'is_auto_refill': res.is_auto_refill,
          'default_refill': res.default_refill,
          'refill_frequency':res.refill_frequency
        });

        const icd10CodeControl = this.addMedicineKit.get('custom_icd10_codes') as FormArray;
        res.icd10_codes.forEach((item:any)=>{
          let icd10FormGroup = new FormGroup({
            'code':new FormControl(item.icd10_code, [Validators.required]),
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
          let attrFormGroup = new FormGroup({
            'name':new FormControl(item.name, [Validators.required]),
            'value':new FormControl(item.value, [Validators.required]),
            'sequence':new FormControl(item.sequence)
          });
          attributesControl.push(attrFormGroup);
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

  public getPetTypeList() {
    const url = 'api/pets/all';
    this.http.get(url).subscribe((pets:any) => {
      this.petTypeList = pets;
      this.changeDetectorRef.detectChanges();
    },(err:any) => {

    });
  }

  public getPetDetails(id:any){
    const url = 'api/pets/view/'+id;
    this.http.get(url).subscribe((pet:any) => {
      var sizes=[
        {
          key:"Unknown",
          value:"UNKNOWN_SIZE"
        },
        {
          key:"Extra Small",
          value:"XS"
        },
        {
          key:"Small",
          value:"SM"
        },
        {
          key:"Medium",
          value:"M"
        },
        {
          key:"Large",
          value:"L"
        },
        {
          key:"Extra Large",
          value:"XL"
        },
        {
          key:"Giant",
          value:"G"
        }
      ];
      this.breedsList=pet.breeds;
      let BreedSizes =pet.breeds.slice().map((item:any)=> {
        let size_Found = sizes.find((si:any)=>si.value == item.size);
        let size_text = size_Found ? size_Found.key : 'Unknown';
        return {size:item.size, size_text: size_text }
      });
      this.breedSizeList =  BreedSizes.filter((value:any, index:number, self:any) => self.findIndex((m:any) => m.size === value.size) === index);

      this.lifeStageList=pet.life_stages;
      this.healthConditionsList=pet.health_conditions;
      this.shopCategoriesList = pet.shop_categories;
      this.changeDetectorRef.detectChanges();
    },(err:any) =>{

    });

  }

  public getDrugTypeList() {
    const url = 'api/drug_types/all';
    this.http.get(url).subscribe((pets:any) => {
      this.drugTypesList = pets;
      this.changeDetectorRef.detectChanges();
    },(err:any) => {

    });
  }

  public getProductFormsList(){
    const url = 'api/product_forms/all';
    this.http.get(url).subscribe((pets:any) => {
      this.productFormsList = pets;
      this.changeDetectorRef.detectChanges();
    },(err:any) => {

    });
  }

  public getBrandsList(){
    const url = 'api/brands/all';
    this.http.get(url).subscribe((brands:any) => {
      this.brandsList = brands;
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
    this.addMedicineKit.value.breeds = this.breedsList.filter((breed: any) => this.addMedicineKit.value.breeds.some((breedId: any) => breedId === breed.id))
    this.addMedicineKit.value.breed_size = this.breedSizeList.filter((itm: any) => this.addMedicineKit.value.breed_size.some((size: any) => size === itm.size))

    this.addMedicineKit.value.icd10_code = this.selectedSimilarDrugs;
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
        if (data != null) {
          if (data.errno != null) {
            this._toastr.showError(data.sqlMessage);
          } else {
            this._router.navigate(['/admin/medicine-kits/list'],{ replaceUrl: true });
            this._toastr.showSuccess('Update Successfully');
          }
          this.changeDetectorRef.detectChanges();
        }
      },
      (err:any) => {
        this._toastr.showError('Unable to update medicine kit.');
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  public NCITCodeSearch(){
    this.ncpdpDrugFormsService.setFormData({index:0});
    this.modalRef = this.modalService.show(NcpdpDrugFormsComponent,{class: 'modal-lg'});
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.selectedDrug.subscribe((receivedEntry:any) => {
      this.addMedicineKit.patchValue({
        ncpdp_unit_code:receivedEntry.ncit_code
      });
      this.modalRef.hide();
    });
  }

  getDoesspotDispenseUnits(){
    const apiURL = 'api/doesspot/listDispenseUnitTypes';
    this.http.get(apiURL).subscribe((data:any) => {
        this.dispenseUnits = data.Items;
    }, (err:any) => {
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

}