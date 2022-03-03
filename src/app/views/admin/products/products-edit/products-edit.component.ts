import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { tap, filter, takeUntil, switchMap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SelectOtcSubcategoryModalComponent } from '../select-otc-subcategory-modal/select-otc-subcategory-modal.component';
import { LensParametersModalComponent } from '../lens-parameters-modal/lens-parameters-modal.component';
import { LensParametersModalService } from '../lens-parameters-modal/lens-parameters-modal.service';
import { SelectOtcSubcategoryModalService } from '../select-otc-subcategory-modal/select-otc-subcategory-modal.service';
import { AppConstants } from 'src/app/constants/AppConstants';
import { BannerlinkModalService } from '../../banner-sets/bannerlink-modal/bannerlink-modal.service';
import { BannerlinkModalComponent } from '../../banner-sets/bannerlink-modal/bannerlink-modal.component';
import { TextEditorModalComponent } from '../../common-components/text-editor-modal/text-editor-modal.component';
import { TextEditorModalService } from '../../common-components/text-editor-modal/text-editor-modal.service';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss']
})
export class ProductsEditComponent implements OnInit {
  pdfIcon: string = '../../../../../assets/img/pdf_file_icon.png'
  videoIcon: string = '../../../../../assets/img/video-play-icon.png'
  productId:any;
  productDetails:any;

  modalRef!:BsModalRef;
  productForm:FormGroup;
  procurementChannels=['MEDICINE','OTC','PRIVATE LABEL','CONTACT LENS','LENS SOLUTION'];
  productTypes = [
    {channel:'MEDICINE',name:'MEDICINE'},
    {channel:'OTC',name:'OTC'},
    {channel:'CONTACT LENS',name:'LENS'},
    {channel:'LENS SOLUTION',name:'SOLUTION'},
    {channel:'PRIVATE LABEL',name:'PRIVATE LABEL'}
  ];

  public oneImageRequired: boolean = false;

  selectedFiles:File[]=[];
  selectedDocuments:File[]=[];
  selectedVideos:File[]=[];
  elementTypes=['DESCRIPTION','LIST','TABLE','HTML'];

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

  public packformFilteringCtrl: FormControl = new FormControl();
  public searchingPackform = false;
  public filteredPackforms: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyPackform = new Subject<void>();

  public drugformFilteringCtrl: FormControl = new FormControl();
  public searchingDrugform = false;
  public filteredDrugforms: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyDrugform = new Subject<void>();

  public therapyFilteringCtrl: FormControl = new FormControl();
  public searchingTherapy = false;
  public searchedTherapiesResult:any[]=[];
  public filteredTherapies: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyTherapy = new Subject<void>();

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

  colorsList:any=[];
  lenstypeList:any[]=[];

  categoriesSubcategoriesList:any[]=[];
  selected_otc_categories_forindex:any[]=[];
  similarProductsList:any=[];
  fbtProductsList:any[]=[];

  constructor(
    public http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute,
    private _helper:Helper,
    private _bsModalService:BsModalService,
    private _textEditorModalService: TextEditorModalService,
    private _bannerLinkModalService:BannerlinkModalService,
    private _lensParametersModalService:LensParametersModalService,
    private _selectOtcSubcategoryModalService:SelectOtcSubcategoryModalService,
    private _toastr: Toastr){

    let activatedRoute:any  = this._route;
    this.productId = activatedRoute.parent.snapshot.paramMap.get('id');
    this.getlensColorsList();

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


      this.drugformFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingDrugform = true),
        takeUntil(this._onDestroyDrugform),
        switchMap((search:any) => {
          return this.filterDrugformResults(search);
        }),
        takeUntil(this._onDestroyDrugform)
      )
      .subscribe((filteredDrugforms:any) => {
        this.searching = false;
        this.filteredDrugforms.next(filteredDrugforms);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });


        this.packformFilteringCtrl.valueChanges
        .pipe(
        filter(search => !!search),
        tap(() => this.searchingPackform = true),
        takeUntil(this._onDestroyPackform),
        switchMap((search:any) => {
          return this.filterPackformResults(search);
        }),
        takeUntil(this._onDestroyPackform)
      )
      .subscribe((filteredPackforms:any) => {
        this.searching = false;
        this.filteredPackforms.next(filteredPackforms);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });


        this.therapyFilteringCtrl.valueChanges
        .pipe(
        filter(search => !!search),
        tap(() => this.searchingTherapy = true),
        takeUntil(this._onDestroyTherapy),
        switchMap((search:any) => {
          return this.filterTherapyResults(search);
        }),
        takeUntil(this._onDestroyTherapy)
      )
      .subscribe((filteredTherapies:any) => {
        this.searching = false;
        this.filteredTherapies.next(filteredTherapies);

        for(let item of filteredTherapies){
          if(this.searchedTherapiesResult.filter((a)=>a._id==item._id).length==0){
            this.searchedTherapiesResult.push(item);
          }
        }


      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });



    this.productForm = new FormGroup({
      name:new FormControl(null,[Validators.required]),
      ucode:new FormControl(null,[Validators.required]),
      procurement_channel:new FormControl(null,[Validators.required]),
      manufacturer_id:new FormControl(null,[]),
      brand_id:new FormControl(null,[]),
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
      lens_type_ids:new FormControl([], []),
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

  get lens_type_ids(){return this.productForm.get('lens_type_ids');}

  setProductType(event:any){
    let productType:any=this.productTypes.find((item:any)=>item.channel == event.target.value);
    this.productForm.patchValue({
      product_type:productType.name
    });
  }

  setProductChannel(event:any){
    let productType:any=this.productTypes.find((item:any)=>item.name == event.target.value);
    this.productForm.patchValue({
      procurement_channel:productType.channel
    });
  }

  handleTherapySelected(event:any){
      let selectedTherapies = this.searchedTherapiesResult.filter((a)=>event.value.indexOf(a._id)!=-1);
      this.filteredTherapies.next(selectedTherapies);
  }

  async filterManufacturesResults(token: string) {
    return this.getAllManufacturers(token).then((data:any)=>{
      return data;
    });
  }

  async getAllManufacturers(searchTerm:string):Promise<any>{
    return await this.http.get(`api/manufacturers/all`+`?search=${searchTerm}`).toPromise();
  }


  async filterDrugformResults(token: string) {
    return this.getAllDrugForms(token).then((data:any)=>{
      return data;
    });
  }

  async getAllDrugForms(searchTerm:string):Promise<any>{
    return await this.http.get(`api/productforms/all`+`?search=${searchTerm}`).toPromise();
  }

  async filterPackformResults(token: string) {
    return this.getAllPackForms(token).then((data:any)=>{
      return data;
    });
  }

  async getAllPackForms(searchTerm:string):Promise<any>{
    return await this.http.get(`api/packforms/all`+`?search=${searchTerm}`).toPromise();
  }

  async filterTherapyResults(token: string) {
    return this.getAllTherapies(token).then((data:any)=>{
      return data;
    });
  }

  async getAllTherapies(searchTerm:string):Promise<any>{
    return await this.http.get(`api/therapies/all`+`?search=${searchTerm}`).toPromise();
  }

  async filterBrandsResults(token: string) {
    return this.getAllBrands(token).then((data:any)=>{
      return data;
    });
  }

  async getAllBrands(searchTerm:string):Promise<any>{
    let manufacturer_id_control = this.productForm.get('manufacturer_id');
    let manufacturer_id = manufacturer_id_control ? manufacturer_id_control.value : '';
    return await this.http.get(`api/brands/all`+`?search=${searchTerm}&manufacturer_id=${manufacturer_id}`).toPromise();
  }

  public getlensTypesList(){
    this.http.get('api/contact_lens/all_types').subscribe((data:any) => {
      this.lenstypeList = data;
    }, err => {

    });
  }

  public getlensColorsList(){
    this.http.get('api/contact_lens/all_colors').subscribe((data:any) => {
      this.colorsList = data;
    }, err => {

    });
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();

    this._onDestroyBrand.next();
    this._onDestroyBrand.complete();

    this._onDestroyDrugform.next();
    this._onDestroyDrugform.complete();

    this._onDestroyPackform.next();
    this._onDestroyPackform.complete();

    this._onDestroyTherapy.next();
    this._onDestroyTherapy.complete();

    if(this.is_active_control_sub){this.is_active_control_sub.unsubscribe();}
    if(this.is_coming_soon_control_sub){this.is_coming_soon_control_sub.unsubscribe();}
  }

  openParametersModal(drugIndex:number,paramName:string){
    this._lensParametersModalService.setFormData({
        index:drugIndex,
        parameter:paramName,
        colorsList:this.colorsList
    });
    this.modalRef = this._bsModalService.show(LensParametersModalComponent,{class:'modal-lg'});
    this.modalRef.content.onApplySelected.subscribe((item:any)=>{
      if(item.parameter=='CYLINDER'){
        this.clearFormArray(this.lensCylinderParameters(item.index));
      }
      else if(item.parameter=='POWER'){
          this.clearFormArray(this.lensPowerParameters(item.index));
      }
      else if(item.parameter=='BASE_CURVE'){
          this.clearFormArray(this.lensBCParameters(item.index));
      }
      else if(item.parameter=='DIAMETER'){
          this.clearFormArray(this.lensDiamenterParameters(item.index));
      }
      else if(item.parameter=='COLOR'){
        this.clearFormArray(this.lensColorParameters(item.index));
      }
      else{
      }
      for(let i of item.options){
        this.addParameter(item.index,item.parameter,i);
      }
    });
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


  ngOnInit(){
    this.getlensTypesList();
    this.getlensColorsList();
    this.getAllCategoriesWithSubcategoriesList();
    this.getproductDetails();
  }

  getproductDetails() {
    const url = 'api/products/view/' + this.productId;
    this.http.get(url).subscribe((res: any) => {
        this.productDetails = res;
        this.similarProductsList = res.similar_products;
        this.fbtProductsList= res.fbt_products;

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

        if(res.form_name){
          this.filteredDrugforms.next([
            res.form_name
          ]);
        }

        if(res.packform){
          this.filteredPackforms.next([
            res.packform
          ]);
        }

        if(res.therapies){
          this.filteredTherapies.next(res.therapies);
        }

        if(res.product_type=='OTC' && res.otc_categories){
          this.selected_otc_categories_forindex=[
              {
                index:0,
                data:res.otc_categories
              }
          ];
        }

        this.productForm.patchValue({
          name:res.name,
          ucode:res.ucode,
          procurement_channel:res.procurement_channel,
          product_type:res.product_type,
          manufacturer_id:res.manufacturer_id ? res.manufacturer_id._id:null,
          brand_id:res.brand_id ? res.brand_id._id:null,
          measurement_unit:res.measurement_unit,
          form_name:res.form_name ? res.form_name._id:null,
          schedule:res.schedule,
          packform:res.packform ? res.packform._id : null,
          is_rx_required:res.is_rx_required,
          is_refrigerated:res.is_refrigerated,
          is_chronic:res.is_chronic,
          is_active:res.is_active,
          is_coming_soon:res.is_coming_soon,
          max_quantity:res.max_quantity,
          product_volume:res.product_volume,

          is_gst_applicable:res.is_gst_applicable,
          gst_tax_percentage:res.gst_tax_percentage,
          hsn_code:res.hsn_code,

          price_per_unit:res.price_per_unit,
          list_price:res.list_price,
          mrp_price:res.mrp_price,
          sale_price:res.sale_price,
          is_discount:res.is_discount,
          discount_amount:res.discount_amount,
          discount_percent:res.discount_percent,
          therapies:res.therapies ? res.therapies.map((item:any)=>item._id):[],

          has_diameter: res.lens_parameters ? res.lens_parameters.has_diameter:null,
          has_basecurve: res.lens_parameters ? res.lens_parameters.has_basecurve:null,
          has_power: res.lens_parameters ? res.lens_parameters.has_power:null,
          has_cylinder: res.lens_parameters ? res.lens_parameters.has_cylinder:null,
          has_axis: res.lens_parameters ? res.lens_parameters.has_axis:null,
          has_addpower: res.lens_parameters ? res.lens_parameters.has_addpower:null,
          has_color: res.lens_parameters ? res.lens_parameters.has_color:null,

          has_fixed_diameter_options: res.lens_parameters ? res.lens_parameters.has_fixed_diameter_options:null,
          has_fixed_basecurve_options: res.lens_parameters ? res.lens_parameters.has_fixed_basecurve_options:null,
          has_fixed_power_options: res.lens_parameters ? res.lens_parameters.has_fixed_power_options:null,
          has_fixed_cylinder_options: res.lens_parameters ? res.lens_parameters.has_fixed_cylinder_options:null,
          has_fixed_addpower_options: res.lens_parameters ? res.lens_parameters.has_fixed_addpower_options:null,
          has_fixed_color_options: res.lens_parameters ? res.lens_parameters.has_fixed_color_options:null,
          lens_type_ids: res.lens_parameters ? res.lens_parameters.lens_type_ids:[]

        });

        const faqsControl = this.productForm.get('faqs') as FormArray;
        res.faqs.forEach((item:any)=>{
          let faqFormGroup = new FormGroup({
            'question':new FormControl(item.question, [Validators.required]),
            'answer':new FormControl(item.answer, [Validators.required]),
            'sequence':new FormControl(item.sequence)
          });
          faqsControl.push(faqFormGroup);
        });

        const attributesControl = this.productForm.get('attributes') as FormArray;
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

        if(res.product_type=='LENS'){

        }
        if(res.lens_parameters && res.lens_parameters.cylinder_parameters.length>0){
          this.clearFormArray(this.lensCylinderParameters(0));
          for(let item of  res.lens_parameters.cylinder_parameters){
             this.addParameter(0,'CYLINDER',item.value);
          }
        }

        if(res.lens_parameters && res.lens_parameters.power_parameters.length>0){
            this.clearFormArray(this.lensPowerParameters(0));
            for(let item of  res.lens_parameters.power_parameters){
            this.addParameter(0,'POWER',item.value);
            }
        }
        if(res.lens_parameters && res.lens_parameters.basecurve_parameters.length>0){
            this.clearFormArray(this.lensBCParameters(0));
            for(let item of res.lens_parameters.basecurve_parameters){
            this.addParameter(0,'BASE_CURVE',item.value);
            }
        }

        if(res.lens_parameters && res.lens_parameters.diameter_parameters.length>0){
            this.clearFormArray(this.lensDiamenterParameters(0));
            for(let item of res.lens_parameters.diameter_parameters){
            this.addParameter(0,'DIAMETER',item.value);
            }
        }

        if(res.lens_parameters && res.lens_parameters.addpower_parameters.length>0){
          this.clearFormArray(this.lensDiamenterParameters(0));
          for(let item of res.lens_parameters.add_power_parameters){
          this.addParameter(0,'ADD_POWER',item.value);
          }
        }

       if(res.lens_parameters && res.lens_parameters.color_parameters.length>0){
        this.clearFormArray(this.lensDiamenterParameters(0));
        for(let item of res.lens_parameters.color_parameters){
        this.addParameter(0,'COLOR',item.value);
        }
       }



      },(err:any) => {

      });
  }


  public saveProduct(isValid:boolean){
    if (!isValid){
      this._helper.markFormGroupTouched(this.productForm);
      return;
    }
    const fd: FormData = new FormData();

    let productVal = this.productForm.value;
    productVal.oldImages = this.productDetails.images;
    productVal.oldDocuments = this.productDetails.documents;
    productVal.oldVideos = this.productDetails.videos;
    productVal.otc_drug_categories = this.get_selected_otc_categories_forindex(0);
    fd.append('product', JSON.stringify(productVal));

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
    const url = `api/products/update/${this.productId}`;
    const req = fd;
    this.http.post(url, req).subscribe(
      (data: any) => {
          this._router.navigate(['/admin/products/list'],{ replaceUrl: true });
          this._toastr.showSuccess('Update Successfully');
      },
      (err:any) => {
        this._toastr.showError('Unable to update product.');
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  defaultImageChange (imgId: any, event: any) {
    this.productDetails.images.map((img: any) => {
      if(img._id == imgId) {
        img.is_default = event.target.checked
      } else {
        img.is_default = !event.target.checked
      }
    })
  }

  deleteImage(img: any){
    let defaultImagesLength: number = this.productDetails.images.filter((img: any) => img.is_default).length + this.productForm.value.images.filter((img: any) => img.is_default).length
    if (defaultImagesLength > 0) {
      let index: number = this.productDetails.images.findIndex((data: any) => data._id === img._id);
      if(index != -1) {
        this.productDetails.images.splice(index, 1);
      }
    }
  }
  deleteDocument(doc: any){
    let index: number = this.productDetails.documents.findIndex((data: any) => data._id === doc._id);
    if(index != -1) {
      this.productDetails.documents.splice(index, 1);
    }
  }
  deleteVideo(video: any){
    let index: number = this.productDetails.videos.findIndex((data: any) => data._id === video._id);
    if(index != -1) {
      this.productDetails.videos.splice(index, 1);
    }
  }

  getUrl(url: string) {
    return environment.api_url + url
  }



  public getAllCategoriesWithSubcategoriesList(){
    this.http.get('api/otc_categories/all').subscribe((data:any) => {
      this.categoriesSubcategoriesList = data;
    }, err => {

    });
  }

  openSelectOTCCategoryModal(drugIndex:number=0){
    let data_for_index =  this.get_selected_otc_categories_forindex(drugIndex);
    if(data_for_index.length>0){
      this.categoriesSubcategoriesList.map((item:any)=>{
        let index = data_for_index.findIndex((si:any)=>si._id == item._id);
        if(index!=-1){
          item.is_checked = true;
          item.sub_categories.map((subcat:any)=>{
            subcat.is_checked = data_for_index[index].sub_categories.findIndex((ssc:any)=>ssc._id == subcat._id)!=-1;
            return subcat;
          });
        }else{
          item.is_checked = false;
          item.sub_categories.map((subcat:any)=>{
            subcat.is_checked = false;
            return subcat;
          });
        }
        return item;
      });
    }else{
      this.categoriesSubcategoriesList.map((item:any)=>{
        item.is_checked = false;
        item.sub_categories.map((subcat:any)=>{
          subcat.is_checked = false;
          return subcat;
        });
        return item;
      });
    }
    this._selectOtcSubcategoryModalService.setFormData({
      categories:this.categoriesSubcategoriesList
    });
    this.modalRef = this._bsModalService.show(SelectOtcSubcategoryModalComponent,{class:'modal-lg'});
    this.modalRef.content.onApplySelected.subscribe((data:any)=>{
       let indexFound = this.selected_otc_categories_forindex.findIndex((item:any)=>item.index==drugIndex);
       if(indexFound==-1){
         let obj={
           index:drugIndex,
           data:data
         };
        this.selected_otc_categories_forindex.push(obj);
       }else{
        this.selected_otc_categories_forindex[indexFound]['data']=data;
       }
       console.log('selected_otc_categories_forindex=',this.selected_otc_categories_forindex);
    });
  }

  get_selected_otc_categories_forindex(drugIndex:number){
    let index = this.selected_otc_categories_forindex.findIndex((item:any) => item.index == drugIndex);
    if(index!=-1){
      return this.selected_otc_categories_forindex[index].data;
    }else{
      return [];
    }
  }

  openSearchProductModal(clickedFrom:any){
    this._bannerLinkModalService.setFormData({
      selectedTab:'PRODUCT'
    });
    this.modalRef = this._bsModalService.show(BannerlinkModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe((data:any)=>{
        if(clickedFrom=='similar_products'){
            if(this.similarProductsList.filter((item:any)=>item._id.toString() == data._id.toString()).length==0){
              this.similarProductsList.push(data);
            }
        }else{
          if(this.fbtProductsList.filter((item:any)=>item._id.toString() == data._id.toString()).length==0){
            this.fbtProductsList.push(data);
          }
        }
    });
  }

  deleteSimilarProduct(product_id:any){
    this.similarProductsList =  this.similarProductsList.filter((item:any)=>item._id.toString() != product_id.toString());
  }

  deleteFBTProduct(product_id:any){
    this.fbtProductsList =  this.fbtProductsList.filter((item:any)=>item._id.toString() != product_id.toString());
  }


  openHTMLEditorModal(formIndex: number){
    this._textEditorModalService.setFormData(this.attributes().at(formIndex).value.value_html);
    this.modalRef = this._bsModalService.show(TextEditorModalComponent, {class: 'modal-full-lg', backdrop : 'static', keyboard : false});
    this.modalRef.content.onEventCompleted.subscribe((receivedHTML:any) => {
      this.attributes().at(formIndex).patchValue({
        value_html: receivedHTML
      })
      this.modalRef.hide();
    });
  }
}
