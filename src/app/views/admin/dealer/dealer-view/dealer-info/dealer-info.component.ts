import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-dealer-info',
  templateUrl: './dealer-info.component.html',
  styleUrls: ['./dealer-info.component.scss']
})
export class DealerInfoComponent implements OnInit,OnDestroy {


  @BlockUI('dealer') blockDealerUI!: NgBlockUI;
 
  dealerId:any;
  dealerDetails:any;
  routerSubscription:any;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(){
    let activeRoute:any = this.route;
    if(activeRoute){
      this.routerSubscription = activeRoute.parent.parent.params.subscribe((params:any) => {
        this.dealerId = params['id'];
        this.getDealerDetails();
      });
    }
  }

  getDealerDetails(){
    this.blockDealerUI.start();
    const url = 'api/admin/dealers/view/' + this.dealerId;
    this.http.get(url).subscribe(async (data: any) => {
      this.blockDealerUI.stop();
      this.dealerDetails = data;
    }, err => {
      this.blockDealerUI.stop();
    });
  }


  ngOnDestroy(){
     if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
     }
     if(this.blockDealerUI){this.blockDealerUI.unsubscribe();}
  }
}
