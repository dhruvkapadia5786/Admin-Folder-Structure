import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Lightbox } from 'ngx-lightbox';
import { Toastr } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-pharmacy-details',
  templateUrl: './pharmacy-details.component.html',
  styleUrls: ['./pharmacy-details.component.scss']
})
export class PharmacyDetailsComponent implements OnInit {

  pharmId: any;
  pharmDetails: any;
  customerUinqueNumber: any;
  selectedDoesspotPharmacy: any;

  @BlockUI('licenseImage') blockLicenseImageUI!: NgBlockUI;
  imageUrl: any = '../../../../assets/img/no-image.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'License image',
    thumb: this.imageUrl
  }];

  public pharmacyDocuments: any[] = [];
  public searchResults: any[] = [];

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    public toastr: Toastr,
    public helper: Helper,
    private router: Router,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private _lightbox: Lightbox) {

    let activeRoute:any = this.route;
    activeRoute.parent.paramMap.subscribe((params:any) => {
      this.pharmId = params.get('id');
    });

  }

  ngOnInit() {
    this.getPharmDetails();
  }

  getPharmDetails() {
    const url = 'api/pharmacies/view/' + this.pharmId;
    this.http.get(url).subscribe((details: any) => {
        this.pharmDetails = details;
        if (this.pharmDetails.professional_liability_document != null) {
          this.pharmDetails.professional_liability_document = this.getLocalImage(this.pharmDetails.professional_liability_document);
        }
        this.changeDetectorRef.detectChanges();
      }, (err: any) => {
        console.log('Error > ', err)
      });
  }

  getLocalImage(path:any) {
    if(path!=null){
      return environment.api_url+path;
    }else{
      return '/src/assets/img/no_preview.png';
    }
  }


  open(): void {
    this._lightbox.open(this._albums, 0, { centerVertically: true });
  }

  close() {
    this._lightbox.close();
  }

  async getImage(path: string) {
    this.blockLicenseImageUI.start();
    await this.http.post('api/document/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
        this.blockLicenseImageUI.stop();
      }
    })
      .catch(err => {
        this.imageUrl = '../../../../assets/img/no-image.png';
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
        this.blockLicenseImageUI.stop();
      })
  }
}
