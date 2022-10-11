import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kits-drugs',
  templateUrl: './kits-drugs.component.html',
  styleUrls: ['./kits-drugs.component.scss']
})
export class KitsDrugsComponent implements OnInit, AfterViewInit {
  public counts: any = {};

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getDashbordStats();
  }


  getDashbordStats() {
    const countUrl = `api/v1/admin/reports/kit-drug-service-count`
    this.http.get(countUrl)
      .subscribe((res: any) => {

        this.counts = res;
      }, err => {

      });
  }

  goToDetails(type: string, paramName: any, paramValue: any){
    if (type == 'STATE') {
      this.router.navigate(['admin', 'states'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'MEDICINE_KIT') {
      this.router.navigate(['admin', 'medicine-kits', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'DRUGS') {
      this.router.navigate(['admin', 'druginfo', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'DOCTOR') {
      this.router.navigate(['admin', 'doctors', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'TECHNICIAN') {
      this.router.navigate(['admin', 'technicians', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'PHARMACY') {
      this.router.navigate(['admin', 'pharmacies', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'ARPN') {
      this.router.navigate(['admin', 'arpns', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'CLINIC') {
      this.router.navigate(['admin', 'clinic', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'HEALTH_CONDITION') {
      this.router.navigate(['admin', 'health-conditions'], { queryParams: { [paramName]: paramValue}});
    }else if (type == 'TREATMENT_CONDITION') {
      this.router.navigate(['admin', 'conditions', 'list'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'OTC_CATEGORIES') {
      this.router.navigate(['admin', 'categories'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'OTC') {
      this.router.navigate(['admin', 'otc-drugs'], { queryParams: { [paramName]: paramValue}});
    } else if (type == 'DRUGS_INFO') {
      this.router.navigate(['admin', 'druginfo', 'list'], { queryParams: { [paramName]: paramValue}});
    }
    else if (type == 'LENS_BRANDS'){
      this.router.navigate(['admin', 'contactlenses-brands'], { queryParams: { [paramName]: paramValue}});
    }
    else if (type == 'LENS_COLORS'){
      this.router.navigate(['admin', 'contactlenses-colors'], { queryParams: { [paramName]: paramValue}});
    }
    else if (type == 'LENS_MANUFACTURERS'){
      this.router.navigate(['admin', 'contactlenses-manufacturers'], { queryParams: { [paramName]: paramValue}});
    }
    else if (type == 'LENS_TYPES'){
      this.router.navigate(['admin', 'contactlenses-types'], { queryParams: { [paramName]: paramValue}});
    }
    else if (type == 'LENS'){
      this.router.navigate(['admin', 'contactlenses-products','list'], { queryParams: { [paramName]: paramValue}});
    }
    else if (type == 'SOLUTION'){
      this.router.navigate(['admin', 'contactlenses-products','solutions'], { queryParams: { [paramName]: paramValue}});
    }
  }

}
