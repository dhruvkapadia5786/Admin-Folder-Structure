import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public questions: any = [];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  kitList: any = [];
  chcList: any = [];
  selectedKits: any = [];
  selectedCategory: any = '';

  public categoryList: any = [
    { type: 'Order', value: 'ORDER' }
  ]

  medicineKitId: any;
  showHeaderAndFilter: boolean = true;

  constructor(public http: HttpClient,
    public _helper: Helper,
    private _changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
    this.medicineKitId = this.route.parent?.parent?.snapshot.paramMap.get('kit_id');

    if (this.medicineKitId) {
      this.showHeaderAndFilter = false
      this.selectedKits.push(this.medicineKitId)
    }
  }

  ngOnInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100
    };
    this.getAllQuestions();
    this.getMedicineKits();
  }

  ngOnDestroy(): void {
    /* this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    }); */
  }

  getAllQuestions() {
    const url = `api/questions/list?kits=${this.selectedKits}&category=${this.selectedCategory}`;
    this.http.get(url).subscribe((questions: any) => {
      this.questions = questions.data;
    }, err => {
    });
    this._changeDetectorRef.detectChanges();
  }

  viewQuestion(questionID: number) {
    this.router.navigate(['admin', 'questions', 'view-question', questionID]);
  }

  editQuestion(questionEditId: number) {
    this.router.navigate(['admin', 'questions', 'edit', questionEditId]);
  }

  get notSelectedMedicineKit() {
    return this.kitList.filter((data: any) => !this.selectedKits.some((b: any) => b === data._id)).length;
  }

  public getMedicineKits() {
    const url = 'api/medicine_kits/all';
    this.http.get(url).subscribe((medicineKitList: any) => {
      this.kitList = medicineKitList;
    }, err => {});
  }

  public handleCheckAll(event: any, flag: any) {
    if (flag == 'MK') {
      if (event.checked) {
        this.selectedKits = this.kitList.map((data: any) => data.id);
      } else {
        this.selectedKits = [];
      }
    }
    this.getAllQuestions();
  }

  clearFilter() {
    this.selectedKits = [];
    this.getAllQuestions();
  }

  handleChange(event: any) {
    this.getAllQuestions();
  }

}
