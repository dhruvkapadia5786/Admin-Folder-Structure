import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Toastr } from 'src/app/services/toastr.service';
import { Lightbox } from 'ngx-lightbox';
import { Subscription } from 'rxjs';
import Hashids from 'hashids';
import { MedicineKitsService } from '../../medicine-kits.service';

@Component({
  selector: 'app-info-medicine-kit',
  templateUrl: './info-medicine-kit.component.html',
  styleUrls: ['./info-medicine-kit.component.scss']
})
export class InfoMedicineKitComponent implements OnInit, OnDestroy {
  medicineKitId: any;
  medicineKitDetails: any;
  public imageUrl: any = '../../../../assets/img/no-image.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'Medicien Kit',
    thumb: this.imageUrl
  }];
  hashId = new Hashids('teledaddy', 10, 'abcdefghijklmnopqrstuvwxyz0123456789');
  routeSubscribe: any;
  subscription: Subscription;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _medicineKitsService: MedicineKitsService,
    private sanitizer: DomSanitizer,
    private _lightbox: Lightbox,
    public _toastr: Toastr
  ) {
    this.routeSubscribe = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let activatedRoute:any = this.route;
        this.medicineKitId = activatedRoute.parent.parent.snapshot.paramMap.get('kit_id');
        this.getMedicineKitDetails();
      }
    });

    this.subscription = this._medicineKitsService.medicineKitsPublished$.subscribe((data:any) => {
      if (data == 'KIT_UPDATED'){
        this.getMedicineKitDetails();
      }
      this._changeDetectorRef.detectChanges();
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if(this.subscription){ this.subscription.unsubscribe(); }
    if (this.routeSubscribe) { this.routeSubscribe.unsubscribe(); }
  }

  getMedicineKitDetails() {
    const url = 'api/v1/admin/medicinekits/details/' + this.medicineKitId;
    this.http.get(url)
      .subscribe((res: any) => {
        this.medicineKitDetails = res;
        if (this.medicineKitDetails.image_url) {
          this.getImage(this.medicineKitDetails.image_url);
        } else {
          this.imageUrl = 'assets/img/no-image.png';
          this._albums = [];
          this._albums.push({
            src: this.imageUrl,
            caption: 'Medicine Kit',
            thumb: this.imageUrl
          });
        }
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  getAgeGroup(ageGroup: string) {
    if (ageGroup == 'PLUS18') { return 'Age 18 + '; }
    else if (ageGroup == 'PLUS21') { return 'Age 21 + '; }
    else if (ageGroup == 'ALL') { return 'All Age'; }
    else { return ''; }
  }

  async getImage(path: string) {
    await this.http.post('api/v1/admin/document/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'Medicine Kit',
          thumb: this.imageUrl
        });
      }
    }).catch(err => {
      this.imageUrl = 'assets/img/no-image.png';
      this._albums = [];
      this._albums.push({
        src: this.imageUrl,
        caption: 'Medicine Kit',
        thumb: this.imageUrl
      });
      //
    })
  }
  open(): void {
    this._lightbox.open(this._albums, 0, { centerVertically: true });
  }

  close() {
    this._lightbox.close();
  }

  updateStateStatus(event: any, state: any) {
    const url = 'api/v1/admin/medicinekits/manage_kit_states';
    const obj = {
      'kit_id': this.medicineKitId,
      'state_id': state.state_id,
      'is_active': state.is_active
    }
    this.http.post(url, obj).subscribe((data: any) => {
      this._changeDetectorRef.detectChanges();
    }, err => {
    });
  }
}
