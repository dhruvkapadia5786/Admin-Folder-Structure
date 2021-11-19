import { Component, OnChanges, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-doument-list',
  templateUrl: './doument-list.component.html',
  styleUrls: ['./doument-list.component.scss']
})
export class DoumentListComponent implements OnChanges {
  @Input() header?: string = 'Documents'
  @Input() enableHeader?: boolean = true
  @Input() userId: any;
  dtOptions!: DataTables.Settings;

  userDocuments: any[] = [];
  constructor(
    public http: HttpClient
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUserDocuments()
  }

  getUserDocuments() {
    const url = 'api/v1/admin/document/for_user/' + this.userId;
    this.http.post(url, {})
      .subscribe((documents: any) => {
        this.userDocuments = documents.data;
      }, err => {
        
      });
  }

  getDocumentUrl(documentURL:string){
    return environment.api_url + documentURL.substring(3);
  }

  viewDocument(path:string){
    let url = this.getDocumentUrl(path);
    window.open(url,'_blank');
  }

  manageVisibilityDocument(document_id:number,status:number){
    let url = `api/v1/admin/document/manage/${document_id}/${status}`;
    this.http.post(url,{}).subscribe((res: any) => {
        this.getUserDocuments();
    }, (err: any) => {
   
    });
  }

  deleteDocument(document_id:number){
    let url = `api/v1/admin/document/delete/${document_id}`;
    this.http.post(url,{}).subscribe((res: any) => {
      this.getUserDocuments();
    }, (err: any) => {
   
    });
  }

}
