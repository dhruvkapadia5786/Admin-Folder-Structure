import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';
import {AppConstants} from 'src/app/constants/AppConstants';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { tap, filter, takeUntil, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.scss']
})
export class ProductsAddComponent implements OnInit,OnDestroy {

  productForm:FormGroup;
  procurementChannels=['MEDICINE','OTC','PRIVATE LABEL','CONTACT LENS','LENS SOLUTION'];
  productTypes= ['MEDICINE','OTC','LENS','SOLUTION'];
  packforms:any[]=[];
  drugforms:any[]=[];

  selectedFiles:File[]=[];
  selectedDocuments:File[]=[];
  selectedVideos:File[]=[];

  elementTypes=['DESCRIPTION','LIST','TABLE','LINK'];

  protected brands: any[] = [];
  public brandFilteringCtrl: FormControl = new FormControl();
  public searchingBrand = false;
  public filteredBrands: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyBrand = new Subject<void>();


  protected manufacturers: any[] = [];
  public manufacturerFilteringCtrl: FormControl = new FormControl();
  public searching = false;
  public filteredManufacturers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  is_coming_soon_control_sub!:Subscription;
  is_active_control_sub!:Subscription;
  is_gst_applicable_sub!:Subscription;

  indiaDrugSchedules = AppConstants.indiaDrugSchedules;
  parameterTypes=AppConstants.parameterTypes;
  negativePowerDefaultOptions=AppConstants.negativePowerDefaultOptions;
  positivePowerDefaultOptions= AppConstants.positivePowerDefaultOptions;
  cylinderDefaultOptions= AppConstants.cylinderDefaultOptions;
  diameterDefaultOptions= AppConstants.diameterDefaultOptions;
  basecurveDefaultOptions = AppConstants.basecurveDefaultOptions;
  materialsDefaultOptions =AppConstants.materialsDefaultOptions;

  selectedCylinderOptions:any=[];
  selectedDiameterOptions:any=[];
  selectedBasecurveOptions:any=[];
  selectedPowersOptions:any=[];
  selectedAddPowersOptions:any=[];
  selectedColorOptions:any=[];


  constructor(
    public http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _helper:Helper,
    private _toastr: Toastr){

      this.manufacturerFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        switchMap((search:any) => {
          return this.filterManufacturesResults(search);
        }),
        takeUntil(this._onDestroy)
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


      this.productForm = new FormGroup({
          name:new FormControl(null,[Validators.required]),
          ucode:new FormControl(null,[Validators.required]),
          procurement_channel:new FormControl(null,[Validators.required]),
          manufacturer_id:new FormControl(null,[Validators.required]),
          brand_id:new FormControl(null,[Validators.required]),
          product_type:new FormControl(null,[Validators.required]),
          measurement_unit:new FormControl(null,[Validators.required]),
          packform:new FormControl(null,[Validators.required]),
          form_name:new FormControl(null,[]),
          schedule:new FormControl(null,[]),
          is_rx_required:new FormControl(null,[]),
          is_refrigerated:new FormControl(null,[]),
          is_chronic:new FormControl(null,[]),
          is_active:new FormControl(null,[]),
          is_coming_soon:new FormControl(null,[]),
          max_quantity:new FormControl(null,[Validators.required]),
          product_volume:new FormControl(null,[]),
          is_gst_applicable:new FormControl(null,[]),
          gst_tax_percentage:new FormControl(null,[]),
          hsn_code:new FormControl(null,[]),
          price_per_unit:new FormControl(null,[Validators.required]),
          list_price:new FormControl(null,[Validators.required]),
          mrp_price:new FormControl(null,[Validators.required]),
          sale_price:new FormControl(null,[Validators.required]),
          is_discount:new FormControl(null,[]),
          discount_amount:new FormControl(null,[]),
          discount_percent:new FormControl(null,[]),
          categories:new FormControl([],[]),
          sub_categories:new FormControl([],[]),
          therapies:new FormControl([],[]),
          images:new FormArray([]),
          documents:new FormArray([]),
          videos:new FormArray([]),
          attributes:new FormArray([]),
          faqs:new FormArray([]),

          has_diameter:new FormControl(null, []),
          has_basecurve:new FormControl(null, []),
          has_power:new FormControl(null, []),
          has_cylinder:new FormControl(null, []),
          has_axis:new FormControl(null, []),
          has_addpower:new FormControl(null, []),
          has_color:new FormControl(null, []),
          has_fixed_diameter_options:new FormControl(null, []),
          has_fixed_basecurve_options:new FormControl(null, []),
          has_fixed_power_options:new FormControl(null, []),
          has_fixed_cylinder_options:new FormControl(null, []),
          has_fixed_addpower_options:new FormControl(null, []),
          has_fixed_color_options:new FormControl(null, []),
          diameter_parameters:new FormArray([]),
          basecurve_parameters:new FormArray([]),
          power_parameters:new FormArray([]),
          cylinder_parameters:new FormArray([]),
          addpower_parameters:new FormArray([]),
          color_parameters:new FormArray([]),
      });


    let is_coming_soon_control = this.productForm.get('is_coming_soon');
    let is_active_control = this.productForm.get('is_active');

    if(is_coming_soon_control){
      this.is_coming_soon_control_sub = is_coming_soon_control.valueChanges.subscribe((checked:boolean) => {
        if (checked) {
            this.productForm.patchValue({
              is_active:false
            });
        }
      });
    }

    if(is_active_control){
      this.is_active_control_sub = is_active_control.valueChanges.subscribe((checked:boolean) => {
        if (checked) {
            this.productForm.patchValue({
              is_coming_soon:false
            });
        }
      });
    }

    let is_gst_applicable_control = this.productForm.get('is_gst_applicable');
    let gst_tax_percentage_control = this.productForm.get('gst_tax_percentage');
    let hsn_code_control = this.productForm.get('hsn_code');

    if(is_gst_applicable_control){
      this.is_gst_applicable_sub = is_gst_applicable_control.valueChanges.subscribe((checked:boolean) => {
        if (checked) {
          gst_tax_percentage_control ? gst_tax_percentage_control.setValidators([Validators.required]):'';
          hsn_code_control? hsn_code_control.setValidators([Validators.required]):'';

          gst_tax_percentage_control ? gst_tax_percentage_control.updateValueAndValidity():'';
          hsn_code_control ? hsn_code_control.updateValueAndValidity():'';

        }else{

          gst_tax_percentage_control ? gst_tax_percentage_control.clearValidators():'';
          hsn_code_control? hsn_code_control.clearValidators():'';

          gst_tax_percentage_control ? gst_tax_percentage_control.updateValueAndValidity():'';
          hsn_code_control ? hsn_code_control.updateValueAndValidity():'';
        }
      });
    }
  }

  get name(){return this.productForm.get('name');}
  get ucode(){return this.productForm.get('ucode');}
  get procurement_channel(){return this.productForm.get('procurement_channel');}
  get manufacturer_id(){return this.productForm.get('manufacturer_id');}
  get brand_id(){return this.productForm.get('brand_id');}
  get product_type(){return this.productForm.get('product_type');}
  get measurement_unit(){return this.productForm.get('measurement_unit');}
  get form_name(){return this.productForm.get('form_name');}
  get schedule(){return this.productForm.get('schedule');}
  get packform(){return this.productForm.get('packform');}
  get is_rx_required(){return this.productForm.get('is_rx_required');}
  get is_refrigerated(){return this.productForm.get('is_refrigerated');}
  get is_chronic(){return this.productForm.get('is_chronic');}
  get is_active(){return this.productForm.get('is_active');}
  get is_coming_soon(){return this.productForm.get('is_coming_soon');}
  get max_quantity(){return this.productForm.get('max_quantity');}
  get product_volume(){return this.productForm.get('product_volume');}
  get is_gst_applicable(){return this.productForm.get('is_gst_applicable');}
  get gst_tax_percentage(){return this.productForm.get('gst_tax_percentage');}
  get hsn_code(){return this.productForm.get('hsn_code');}

  get price_per_unit(){return this.productForm.get('price_per_unit');}
  get list_price(){return this.productForm.get('list_price');}
  get mrp_price(){return this.productForm.get('mrp_price');}
  get sale_price(){return this.productForm.get('sale_price');}
  get is_discount(){return this.productForm.get('is_discount');}
  get discount_amount(){return this.productForm.get('discount_amount');}
  get discount_percent(){return this.productForm.get('discount_percent');}
  get categories(){return this.productForm.get('categories');}
  get sub_categories(){return this.productForm.get('sub_categories');}
  get therapies(){return this.productForm.get('therapies');}


  get has_diameter(){return this.productForm.get('has_diameter');}
  get has_basecurve(){return this.productForm.get('has_basecurve');}
  get has_power(){return this.productForm.get('has_power');}
  get has_cylinder(){return this.productForm.get('has_cylinder');}
  get has_axis(){return this.productForm.get('has_axis');}
  get has_addpower(){return this.productForm.get('has_addpower');}
  get has_color(){return this.productForm.get('has_color');}

  get has_fixed_diameter_options(){return this.productForm.get('has_fixed_diameter_options');}
  get has_fixed_basecurve_options(){return this.productForm.get('has_fixed_basecurve_options');}
  get has_fixed_power_options(){return this.productForm.get('has_fixed_power_options');}
  get has_fixed_cylinder_options(){return this.productForm.get('has_fixed_cylinder_options');}
  get has_fixed_addpower_options(){return this.productForm.get('has_fixed_addpower_options');}
  get has_fixed_color_options(){return this.productForm.get('has_fixed_color_options');}


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
    let manufacturer_id = this.productForm.get('manufacturer_id')?.value;
    return await this.http.get(`api/brands/all`+`?search=${searchTerm}&manufacturer_id=${manufacturer_id}`).toPromise();
  }

  ngOnDestroy(){
    this._onDestroy.next();
    this._onDestroy.complete();

    this._onDestroyBrand.next();
    this._onDestroyBrand.complete();

    if(this.is_active_control_sub){this.is_active_control_sub.unsubscribe();}
    if(this.is_coming_soon_control_sub){this.is_coming_soon_control_sub.unsubscribe();}
  }



  openParametersModal(drugIndex:number,paramName:string){

  }


  handleParameterChange(drugIndex:number,paramName:string,checked:any){
    if(checked){
       this.addParameter(drugIndex,paramName,null);
    }else{
       if(paramName=='DIAMETER'){
         this.clearFormArray(this.lensDiamenterParameters(drugIndex));
       }
       else if(paramName=='BASE_CURVE'){
         this.clearFormArray(this.lensBCParameters(drugIndex));
       }
       else if(paramName=='POWER'){
         this.clearFormArray(this.lensPowerParameters(drugIndex));
       }
       else if(paramName=='CYLINDER'){
         this.clearFormArray(this.lensCylinderParameters(drugIndex));
       }
       else if(paramName=='ADD_POWER'){
        this.clearFormArray(this.lensAddPowerParameters(drugIndex));
       }
       else if(paramName=='COLOR'){
        this.clearFormArray(this.lensColorParameters(drugIndex));
       }
      else{

      }
    }
 }


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  lensDiamenterParameters(drugIndex:number): FormArray {
    return this.productForm.get("diameter_parameters") as FormArray;
  }

  uncheckOptionsSwitch(drugIndex:number,paramKey:string,formArray:any){
    if(formArray.length ==0){
        this.productForm.patchValue({
          [paramKey]:false
        });
    }
  }

  lensBCParameters(drugIndex:number): FormArray {
    return this.productForm.get("basecurve_parameters") as FormArray;
  }

  lensPowerParameters(drugIndex:number): FormArray {
    return this.productForm.get("power_parameters") as FormArray;
  }

  lensCylinderParameters(drugIndex:number): FormArray {
    return this.productForm.get("cylinder_parameters") as FormArray;
  }

  lensAddPowerParameters(drugIndex:number): FormArray {
    return this.productForm.get("addpower_parameters") as FormArray;
  }

  lensColorParameters(drugIndex:number): FormArray {
    return this.productForm.get("color_parameters") as FormArray;
  }

  addParameter(drugIndex: number,paramName:string,val:any=null){
    let formItem:any = new FormGroup({
      'parameter_type':new FormControl(paramName, [Validators.required]),
      'label':new FormControl(val, [Validators.required]),
      'value':new FormControl(val, [Validators.required])
    });
    if(paramName=='DIAMETER'){
      this.lensDiamenterParameters(drugIndex).push(formItem);
    }
    else if(paramName=='BASE_CURVE'){
      this.lensBCParameters(drugIndex).push(formItem);
    }
    else if(paramName=='POWER'){
      this.lensPowerParameters(drugIndex).push(formItem);
    }
    else if(paramName=='CYLINDER'){
      this.lensCylinderParameters(drugIndex).push(formItem);
    }
    else if(paramName=='ADD_POWER'){
      this.lensAddPowerParameters(drugIndex).push(formItem);
    }
    else if(paramName=='COLOR'){
      this.lensColorParameters(drugIndex).push(formItem);
    }
    else{

    }
  }

  removeParameter(drugIndex: number,paramName:string,index: number) {
    let paramKey='';
    let formArray:any;
    if(paramName=='DIAMETER'){
      paramKey='has_fixed_diameter_options';
      formArray=this.lensDiamenterParameters(drugIndex);
      formArray.removeAt(index);
    }
    else if(paramName=='BASE_CURVE'){
      paramKey='has_fixed_basecurve_options';
      formArray=this.lensBCParameters(drugIndex);
      formArray.removeAt(index);
    }
    else if(paramName=='POWER'){
      paramKey='has_fixed_power_options';
      formArray=this.lensPowerParameters(drugIndex);
      formArray.removeAt(index);
    }
    else if(paramName=='CYLINDER'){
      paramKey='has_fixed_cylinder_options';
      formArray=this.lensCylinderParameters(drugIndex);
      formArray.removeAt(index);
    }
    else if(paramName=='ADD_POWER'){
      paramKey='has_fixed_addpower_options';
      formArray=this.lensAddPowerParameters(drugIndex);
      formArray.removeAt(index);
    }
    else if(paramName=='COLOR'){
      paramKey='has_fixed_color_options';
      formArray=this.lensColorParameters(drugIndex);
      formArray.removeAt(index);
    }
    else{

    }
    this.uncheckOptionsSwitch(drugIndex,paramKey,formArray);
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
    return this.productForm.get("images") as FormArray
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
    return this.productForm.get("documents") as FormArray
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
    return this.productForm.get("videos") as FormArray
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
    return this.productForm.get("faqs") as FormArray
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
    return this.productForm.get("attributes") as FormArray
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
    if(value=='LIST'){
        this.addAttributeListInput(attributeIndex);
        this.attributesTable(attributeIndex).clear();
    }
    else if(value=='TABLE'){
      this.attributesList(attributeIndex).clear();
      this.addAttributeTableInput(attributeIndex);
    }
    else{
        this.attributesList(attributeIndex).clear();
        this.attributesTable(attributeIndex).clear();
    }
}

/*-----------------------------END OF ATTRIBUTES --------------------------------*/


  ngOnInit(): void {
     this.getAllPackForms();
  }

  getAllPackForms(){
    const url = 'api/products/packforms';
    this.http.get(url).subscribe((res: any) => {
        this.packforms = res;
    });
  }

  getAllDrugForms(){
    const url = 'api/products/drugforms';
    this.http.get(url).subscribe((res: any) => {
        this.drugforms = res;
    });
  }

  getBrandsByManufacturer(manufacturer_id:any){

  }

  addProduct(formValid:boolean){
    if (this.productForm.invalid){
      this._helper.markFormGroupTouched(this.productForm);
      return;
    }
    const fd: FormData = new FormData();
    fd.append('product', JSON.stringify(this.productForm.value));
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
    const url = 'api/products/create';
    const req = fd;
    this.http.post(url, req).subscribe(
      (data: any) => {
        this._router.navigate(['/admin/products/list'],{ replaceUrl: true });
        this._toastr.showSuccess('Save Successfully');
      },
      (err:any) => {
        this._toastr.showError('Unable to save product.');
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
