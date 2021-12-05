import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Toastr } from 'src/app/services/toastr.service';
import { Lightbox } from 'ngx-lightbox';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import Hashids from 'hashids';
import { MedicineKitsService } from '../../medicine-kits.service';

@Component({
  selector: 'app-info-medicine-kit',
  templateUrl: './info-medicine-kit.component.html',
  styleUrls: ['./info-medicine-kit.component.scss']
})
export class InfoMedicineKitComponent implements OnInit, OnDestroy {
  environmentUrl: any = environment
  medicineKitId: any;
  medicineKitDetails: any;
  pdfIcon: string = '../../../../../../../assets/img/pdf_file_icon.png'
  videoIcon: string = '../../../../../../../assets/img/video-play-icon.png'
  public imageUrl: any = '../../../../../../../assets/img/no_preview.png';
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
    const url = 'api/medicine_kits/view/' + this.medicineKitId;
    this.http.get(url)
      .subscribe((res: any) => {
        this.medicineKitDetails = res;
        if (this.medicineKitDetails.image_url) {
          this.getImage(this.medicineKitDetails.image_url);
        } else {
          this.imageUrl = '../../../../../../../assets/img/no_preview.png';
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

  updateSequence (event: any) {
    let dataToSend: any = []

    if (event.mode == 'IMAGES' || event.mode == 'FAQS' || event.mode == 'ATTRIBUTES' || event.mode == 'DOCUMENTS' || event.mode == 'VIDEOS') {
      event.data.forEach((obj: any) => {
        dataToSend.push({ ...obj.item, sequence:obj.sequence });
      });
    } else {
      event.data.forEach((obj: any) => {
        dataToSend.push({ question_id: obj.item.question_id._id, sequence: obj.sequence, _id: obj.item._id });
      });
    }

    let url: string = `api/medicine_kits/update_sequence/${this.medicineKitId}`;
    this.http.post(url, { mode: event.mode, sequences: dataToSend })
      .subscribe(data => {
        this._toastr.showSuccess('Sequence Updated Successfully');

      }, err => {
        this._toastr.showError('Unable to update sequence. Please try again');
      });
  }

  getAgeGroup(ageGroup: string) {
    if (ageGroup == 'PLUS18') { return 'Age 18 + '; }
    else if (ageGroup == 'PLUS21') { return 'Age 21 + '; }
    else if (ageGroup == 'ALL') { return 'All Age'; }
    else { return ''; }
  }

  async getImage(path: string) {
    await this.http.post('api/documents/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
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
      this.imageUrl = '../../../../../../../assets/img/no_preview.png';
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
}
