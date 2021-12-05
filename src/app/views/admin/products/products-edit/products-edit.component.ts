import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { tap, filter, takeUntil, switchMap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

  productForm:FormGroup;
  procurementChannels=['MEDICINE','OTC','PRIVATE LABEL','CONTACT LENS','LENS SOLUTION'];
  productTypes= ['MEDICINE','OTC','LENS','SOLUTION'];
  packforms:any[]=[];

  public oneImageRequired: boolean = false;

  selectedFiles:File[]=[];
  selectedDocuments:File[]=[];
  selectedVideos:File[]=[];

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


  constructor(
    public http: HttpClient,
    public changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute,
    private _helper:Helper,
    private _toastr: Toastr){

    let activatedRoute:any  = this._route;
    this.productId = activatedRoute.parent.snapshot.paramMap.get('id');

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
        is_rx_required:new FormControl(null,[]),
        is_refrigerated:new FormControl(null,[]),
        is_chronic:new FormControl(null,[]),
        is_active:new FormControl(null,[]),
        is_coming_soon:new FormControl(null,[]),
        max_quantity:new FormControl(null,[Validators.required]),
        product_volume:new FormControl(null,[]),
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
  }

  get name(){return this.productForm.get('name');}
  get ucode(){return this.productForm.get('ucode');}
  get procurement_channel(){return this.productForm.get('procurement_channel');}
  get manufacturer_id(){return this.productForm.get('manufacturer_id');}
  get brand_id(){return this.productForm.get('brand_id');}
  get product_type(){return this.productForm.get('product_type');}
  get measurement_unit(){return this.productForm.get('measurement_unit');}
  get packform(){return this.productForm.get('packform');}
  get is_rx_required(){return this.productForm.get('is_rx_required');}
  get is_refrigerated(){return this.productForm.get('is_refrigerated');}
  get is_chronic(){return this.productForm.get('is_chronic');}
  get is_active(){return this.productForm.get('is_active');}
  get is_coming_soon(){return this.productForm.get('is_coming_soon');}
  get max_quantity(){return this.productForm.get('max_quantity');}
  get product_volume(){return this.productForm.get('product_volume');}
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();

    this._onDestroyBrand.next();
    this._onDestroyBrand.complete();

    if(this.is_active_control_sub){this.is_active_control_sub.unsubscribe();}
    if(this.is_coming_soon_control_sub){this.is_coming_soon_control_sub.unsubscribe();}

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
      'key': new FormControl('', [Validators.required]),
      'value': new FormControl('', [Validators.required]),
      'sequence':new FormControl(attr_length+1, []),
    });
  }

  removeAttributeInput(empIndex:number) {
    this.attributes().removeAt(empIndex);
  }

  attributes(): FormArray {
      return this.productForm.get("attributes") as FormArray
  }
  /*-----------------------------END OF ATTRIBUTES --------------------------------*/


  ngOnInit() {
    this.getproductDetails();
  }

  getproductDetails() {
    const url = 'api/products/view/' + this.productId;
    this.http.get(url).subscribe((res: any) => {
        this.productDetails = res;

        this.productForm.patchValue({
          name:res.name,
          ucode:res.ucode,
          procurement_channel:res.procurement_channel,
          manufacturer_id:res.manufacturer_id._id,
          brand_id:res.brand_id._id,
          product_type:res.product_type,
          measurement_unit:res.measurement_unit,
          packform:res.packform,
          is_rx_required:res.is_rx_required,
          is_refrigerated:res.is_refrigerated,
          is_chronic:res.is_chronic,
          is_active:res.is_active,
          is_coming_soon:res.is_coming_soon,
          max_quantity:res.max_quantity,
          product_volume:res.product_volume,
          price_per_unit:res.price_per_unit,
          list_price:res.list_price,
          mrp_price:res.mrp_price,
          sale_price:res.sale_price,
          is_discount:res.is_discount,
          discount_amount:res.discount_amount,
          discount_percent:res.discount_percent,
          categories:res.categories ? res.categories.map((item:any)=>item._id):[],
          sub_categories:res.sub_categories ? res.sub_categories.map((item:any)=>item._id):[],
          therapies:res.therapies ? res.therapies.map((item:any)=>item._id):[]
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
          let attrFormGroup = new FormGroup({
            'key':new FormControl(item.key, [Validators.required]),
            'value':new FormControl(item.value, [Validators.required]),
            'sequence':new FormControl(item.sequence)
          });
          attributesControl.push(attrFormGroup);
        });

      },(err:any) => {

      });
  }


  public saveProduct(isValid:boolean){
    if (!isValid){
      this._helper.markFormGroupTouched(this.productForm);
      return;
    }
    const fd: FormData = new FormData();
    this.productForm.value.oldImages = this.productDetails.images;
    this.productForm.value.oldDocuments = this.productDetails.documents;
    this.productForm.value.oldVideos = this.productDetails.videos;

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
    const url = `api/products/update/${this.productId}`;
    const req = fd;
    this.http.post(url, req).subscribe(
      (data: any) => {
        if (data != null) {
          if (data.errno != null) {
            this._toastr.showError(data.sqlMessage);
          } else {
            this._router.navigate(['/admin/products/list'],{ replaceUrl: true });
            this._toastr.showSuccess('Update Successfully');
          }
          this.changeDetectorRef.detectChanges();
        }
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
}
