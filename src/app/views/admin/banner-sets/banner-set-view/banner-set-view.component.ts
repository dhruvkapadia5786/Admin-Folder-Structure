import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-banner-set-view',
  templateUrl: './banner-set-view.component.html',
  styleUrls: ['./banner-set-view.component.scss']
})
export class BannerSetViewComponent implements OnInit {
  data: any[] = [];
  bannersetId: any;
  bannerSetDetails:any;

  environmentUrl: any = environment
  pdfIcon: string = '../../../assets/img/pdf_file_icon.png'
  videoIcon: string = '../../../assets/img/video-play-icon.png'

  public originalData: any = [];
  public isSequenceUpdated = false;

  constructor(
    private _http:HttpClient,
    private _activeRoute: ActivatedRoute,
    private _toastr: Toastr,
    public cdr: ChangeDetectorRef){

    this.bannersetId = this._activeRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(){
    this.getBannerSetDetails();
  }

  public resetValues(){
    this.data = [];
  }

  public resetSequence(){
    this.data = this.originalData.slice(0);
    this.isSequenceUpdated = false;
  }

  public drop(event: CdkDragDrop<string[]>){
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    this.isSequenceUpdated = true;
  }

  public saveUpdatedSequence(){
    let sequenceArray: any[] = []
    this.data.forEach((item: any, index: any) => {
      sequenceArray.push({ ...item, sequence: (index + 1)});
    });

    this._http.post('api/bannersets/update_sequence/'+this.bannersetId,{sequences:sequenceArray}).subscribe((data: any) => {
      this.getBannerSetDetails();
      this._toastr.showSuccess('Banners Sequence Updated');
    }, (err:any) => {

    });

  }


  public getBannerSetDetails(){
    this._http.get('api/bannersets/view/'+this.bannersetId).subscribe((data: any) => {
        this.bannerSetDetails = data;
        this.data = data.banners;
        this.originalData = this.data.slice(0);
      }, (err:any) => {
      });
  }

}
