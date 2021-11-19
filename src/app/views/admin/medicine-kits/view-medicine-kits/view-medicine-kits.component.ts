import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { MedicineKitsService } from '../medicine-kits.service';

@Component({
  selector: 'app-view-medicine-kits',
  templateUrl: './view-medicine-kits.component.html',
  styleUrls: ['./view-medicine-kits.component.scss']
})
export class ViewMedicineKitsComponent implements OnInit {
  medicineKitDetails: any;
  medicineKitId: any;
  treatmentConditionId: any;
  treatmentConditionList:any[] = []
  medicineKits: any[] = [];

   constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
    public _toastr: Toastr,
    public cdr: ChangeDetectorRef,
    private _medicineKitsService: MedicineKitsService){

    let activatedRoute:any  = this.route;
    this.medicineKitId = activatedRoute.parent.snapshot.paramMap.get('kit_id');
  }

  ngOnInit() {
    this.getMedicineKitDetails();
    this.getTreatmentConditionList();
  }

  getMedicineKitDetails() {
    const url = 'api/v1/admin/medicinekits/details/' + this.medicineKitId;
    this._http.get(url).subscribe((res: any) => {
        this.medicineKitDetails = res;
      },(err:any) => {

      });
  }

  getTreatmentConditionList() {
    this._http.get<any>('api/v1/admin/conditions/all').subscribe((resp:any) => {
      this.treatmentConditionList = resp;
      if (this.treatmentConditionId) {
        this.getMedicineKits(this.treatmentConditionId)
      }
    }, (err:any)=> {});
  }

  public getMedicineKits(conditionId: number) {
    const url = 'api/v1/admin/medicinekits/by_conditions';
    this._http.post(url, { condition_ids: [conditionId] }).subscribe((medicineKitList: any) => {
        this.medicineKits = medicineKitList;
        this.cdr.detectChanges();
      },(err:any) => {

      });
  }

  public onKitChange (kitId: number) {
    this.router.navigate(['admin/medicine-kits/view/treatment',this.treatmentConditionId,'kit',kitId,'info'])
    this.medicineKitId = kitId;
    this.getMedicineKitDetails();
  }

  updateChildren() {
    this._medicineKitsService.publishMedicineKits('KIT_UPDATED');
  }
}
