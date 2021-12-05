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
  selectedTreatmentConditionId: any;
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
    const url = 'api/medicine_kits/view/' + this.medicineKitId;
    this._http.get(url).subscribe((res: any) => {
        this.medicineKitDetails = res;
    },(err:any) => {

    });
  }


  public getTreatmentConditionList() {
    const url = 'api/treatment_conditions/all';
    this._http.get(url).subscribe((data:any) => {
      this.treatmentConditionList = data;
      this.selectedTreatmentConditionId = this.medicineKitDetails.treatment_condition_ids[0]._id;
      if (this.selectedTreatmentConditionId) {
        this.getMedicineKits(this.selectedTreatmentConditionId)
      }
    },(err:any) => {

    });
  }

  public getMedicineKits(id: any) {
    const url = `api/medicine_kits/all?treatment_condition_id=${id}`;
    this._http.get(url).subscribe((medicineKitList: any) => {
        this.medicineKits = medicineKitList;
        this.cdr.detectChanges();
      },(err:any) => {

      });
  }

  public onKitChange (kitId: any) {
    this.router.navigate(['admin/medicine-kits/view/',kitId,'info'])
    this.medicineKitId = kitId;
    this.getMedicineKitDetails();
  }

  updateChildren() {
    this._medicineKitsService.publishMedicineKits('KIT_UPDATED');
  }
}
