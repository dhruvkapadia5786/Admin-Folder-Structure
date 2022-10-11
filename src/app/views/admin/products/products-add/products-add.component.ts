import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { tap, filter, takeUntil, switchMap} from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SelectSubcategoryModalComponent } from '../select-subcategory-modal/select-subcategory-modal.component';
import { SelectSubcategoryModalService } from '../select-subcategory-modal/select-subcategory-modal.service';
import { environment } from 'src/environments/environment';
import { BannerlinkModalService } from '../../banner-sets/bannerlink-modal/bannerlink-modal.service';
import { BannerlinkModalComponent } from '../../banner-sets/bannerlink-modal/bannerlink-modal.component';
import { TextEditorModalComponent } from '../../common-components/text-editor-modal/text-editor-modal.component';
import { TextEditorModalService } from '../../common-components/text-editor-modal/text-editor-modal.service';

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.scss']
})
export class ProductsAddComponent implements OnInit,OnDestroy {

  modalRef!:BsModalRef;
  productForm:FormGroup;
  productTypes = [
    {value:'simple',name:'simple'},
    {value:'variable',name:'Variable'},
  ];

  selectedFiles:File[]=[];
  selectedDocuments:File[]=[];
  selectedVideos:File[]=[];

  elementTypes=['DESCRIPTION','LIST','TABLE','HTML'];

  protected brands: any[] = [];
  public brandFilteringCtrl: FormControl = new FormControl();
  public searchingBrand = false;
  public filteredBrands: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyBrand = new Subject<void>();


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


  colorsList:any=[];
  lenstypeList:any[]=[];

  categoriesSubcategoriesList:any[]=[];
  selected_categories_forindex:any[]=[];

  similarProductsList:any=[];
  fbtProductsList:any[]=[];

  constructor(
    public http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _helper:Helper,
    private _bsModalService:BsModalService,
    private _textEditorModalService: TextEditorModalService,
    private _bannerLinkModalService:BannerlinkModalService,
    private _selectOtcSubcategoryModalService:SelectSubcategoryModalService,
    private _toastr: Toastr){

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
            if(this.searchedTherapiesResult.filter((a)=>a.id==item.id).length==0){
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
          description:new FormControl(null,[]),
          procurement_channel:new FormControl(null,[Validators.required]),
          manufacturer_id:new FormControl(null,[]),
          brand_id:new FormControl(null,[]),
          product_type:new FormControl(null,[Validators.required]),
          measurement_unit:new FormControl(null,[Validators.required]),
          packform:new FormControl(null,[Validators.required]),
          form_name:new FormControl(null,[]),
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
          therapies:new FormControl([],[]),
          images:new FormArray([]),
          documents:new FormArray([]),
          videos:new FormArray([]),
          attributes:new FormArray([]),
          faqs:new FormArray([])
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
  get description(){return this.productForm.get('description');}
  get procurement_channel(){return this.productForm.get('procurement_channel');}
  get manufacturer_id(){return this.productForm.get('manufacturer_id');}
  get brand_id(){return this.productForm.get('brand_id');}
  get product_type(){return this.productForm.get('product_type');}
  get measurement_unit(){return this.productForm.get('measurement_unit');}
  get form_name(){return this.productForm.get('form_name');}
  get packform(){return this.productForm.get('packform');}
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
  get therapies(){return this.productForm.get('therapies');}

 
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
      let selectedTherapies = this.searchedTherapiesResult.filter((a)=>event.value.indexOf(a.id)!=-1);
      this.filteredTherapies.next(selectedTherapies);
  }

  async filterManufacturesResults(token: string) {
    return this.getAllManufacturers(token).then((data:any)=>{
      return data;
    });
  }

  async getAllManufacturers(searchTerm:string):Promise<any>{
    return await this.http.get(`api/admin/manufacturers/all`+`?search=${searchTerm}`).toPromise();
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
    return await this.http.get(`api/admin/brands/all`+`?search=${searchTerm}&manufacturer_id=${manufacturer_id}`).toPromise();
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

  ngOnDestroy(){
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


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  
  uncheckOptionsSwitch(drugIndex:number,paramKey:string,formArray:any){
    if(formArray.length ==0){
        this.productForm.patchValue({
          [paramKey]:false
        });
    }
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


  ngOnInit(): void {
     this.getlensTypesList();
     this.getlensColorsList();
     this.getAllCategoriesWithSubcategoriesList();
  }

  getBrandsByManufacturer(manufacturer_id:any){

  }

  openSearchProductModal(clickedFrom:any){
    this._bannerLinkModalService.setFormData({
      selectedTab:'PRODUCT'
    });
    this.modalRef = this._bsModalService.show(BannerlinkModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe((data:any)=>{
        if(clickedFrom=='similar_products'){
            if(this.similarProductsList.filter((item:any)=>item.id.toString() == data.id.toString()).length==0){
              this.similarProductsList.push(data);
            }
        }else{
          if(this.fbtProductsList.filter((item:any)=>item.id.toString() == data.id.toString()).length==0){
            this.fbtProductsList.push(data);
          }
        }
    });
  }

  deleteSimilarProduct(product_id:any){
    this.similarProductsList =  this.similarProductsList.filter((item:any)=>item.id.toString() != product_id.toString());
  }

  deleteFBTProduct(product_id:any){
    this.fbtProductsList =  this.fbtProductsList.filter((item:any)=>item.id.toString() != product_id.toString());
  }

  addProduct(formValid:boolean){
    if (this.productForm.invalid){
      this._helper.markFormGroupTouched(this.productForm);
      return;
    }
    const fd: FormData = new FormData();
    let productVal = this.productForm.value;
    productVal.categories = this.get_selected_categories_forindex(0);
    productVal.similar_products = this.similarProductsList.map((item:any)=>item.id);
    productVal.fbt_products = this.fbtProductsList.map((item:any)=>item.id);

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
    const url = 'api/products/create';
    const req = fd;
    this.http.post(url, req).subscribe((data: any) => {
        this._router.navigate(['/admin/products/list'],{ replaceUrl: true });
        this._toastr.showSuccess('Save Successfully');
      },
      (err:any) => {
        this._toastr.showError('Unable to save product.');
        this.changeDetectorRef.detectChanges();
      });
  }


  public getAllCategoriesWithSubcategoriesList(){
    this.http.get('api/admin/categories/all').subscribe((data:any) => {
      this.categoriesSubcategoriesList = data;
    }, err => {

    });
  }

  openSelectOTCCategoryModal(drugIndex:number=0){
    let data_for_index =  this.get_selected_categories_forindex(drugIndex);
    if(data_for_index.length>0){
      this.categoriesSubcategoriesList.map((item:any)=>{
        let index = data_for_index.findIndex((si:any)=>si.id == item.id);
        if(index!=-1){
          item.is_checked = true;
          item.sub_categories ?  item.sub_categories.map((subcat:any)=>{
            subcat.is_checked = data_for_index[index].sub_categories.findIndex((ssc:any)=>ssc.id == subcat.id)!=-1;
            return subcat;
          }):[];
        }else{
          item.is_checked = false;
          item.sub_categories ? item.sub_categories.map((subcat:any)=>{
            subcat.is_checked = false;
            return subcat;
          }):[];
        }
        return item;
      });
    }else{
      this.categoriesSubcategoriesList.map((item:any)=>{
        item.is_checked = false;
        item.sub_categories ? item.sub_categories.map((subcat:any)=>{
          subcat.is_checked = false;
          return subcat;
        }):[];
        return item;
      });
    }
    this._selectOtcSubcategoryModalService.setFormData({
      categories:this.categoriesSubcategoriesList
    });
    this.modalRef = this._bsModalService.show(SelectSubcategoryModalComponent,{class:'modal-lg'});
    this.modalRef.content.onApplySelected.subscribe((data:any)=>{
       let indexFound = this.selected_categories_forindex.findIndex((item:any)=>item.index==drugIndex);
       if(indexFound==-1){
         let obj={
           index:drugIndex,
           data:data
         };
        this.selected_categories_forindex.push(obj);
       }else{
        this.selected_categories_forindex[indexFound]['data']=data;
       }
    });
  }

  get_selected_categories_forindex(drugIndex:number){
    let index = this.selected_categories_forindex.findIndex((item:any) => item.index == drugIndex);
    if(index!=-1){
      return this.selected_categories_forindex[index].data;
    }else{
      return [];
    }
  }

  getUrl(url: string) {
    return environment.api_url + url
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
