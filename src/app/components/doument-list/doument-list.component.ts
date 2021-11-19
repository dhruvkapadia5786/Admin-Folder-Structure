import {Component, OnChanges, Input, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-doument-list',
  templateUrl: './doument-list.component.html',
  styleUrls: ['./doument-list.component.scss']})

export class DoumentListComponent implements OnChanges {
  @Input() userId !: string;
  doctorDocuments : any[] = [];
  dtOptions: DataTables.Settings={};

  constructor(public http : HttpClient) {}

  ngOnChanges(changes : SimpleChanges) : void {
    //const val = changes.userId.currentValue;
    const url = 'api/v1/document/active/' + this.userId;
    this
      .http
      .post(url, {})
      .subscribe((documents : any) => {
        this.doctorDocuments = documents.data;
      }, err => {});
  }
  getDocumentUrl(documentURL : any) {
    return environment.api_url + documentURL.substring(3);
  }

}
