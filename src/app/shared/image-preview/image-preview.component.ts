import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Helper } from '../../services/helper.service';
import { DomSanitizer } from '@angular/platform-browser';
//import { HttpClient } from '@angular/common/http';
import { Lightbox } from 'ngx-lightbox';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit, OnChanges {

  @Input() imgPath!: string;
  @Input() height?: string;
  @Input() width?: string;
  @Input() caption?: string;
  @Input() lightBox?: boolean;
  public path: any;
  public maxHeight = '250px';
  public maxWidth = '250px';
  public title = '';
  public isLightBox = true;

  imageUrl: any = '../../../../assets/img/no-preview.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'Full Face Image',
    thumb: this.imageUrl
  }];
  constructor(
    private helper: Helper,
    private sanitizer: DomSanitizer,
    //private http: HttpClient,
    private _lightbox: Lightbox,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const val = changes.imgPath.currentValue;
    this.getImage(val);
    this.maxHeight = (changes.height) ? changes.height.currentValue : this.maxHeight;
    this.maxWidth = (changes.width) ? changes.width.currentValue : this.maxWidth;
    this.title = (changes.caption) ? changes.caption.currentValue : this.title;
    this.isLightBox = (changes.lightBox) ? changes.lightBox.currentValue : this.isLightBox;
  }


  getImage(imageName:string){
    let url = imageName ? imageName.substr(imageName.indexOf('uploads')):null;
    if (url) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(environment.api_url + url);
      this._albums = [];
      this._albums.push({
        src: this.imageUrl,
        caption: this.title,
        thumb: this.imageUrl
      });
    }
  }

  open(){
     if (this.isLightBox) {
      this._lightbox.open(this._albums, 0, { centerVertically: true });
      return true;
    } else {
      return false;
    }
  }

}