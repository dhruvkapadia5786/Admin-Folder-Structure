import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-seller-info',
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.scss']
})
export class SellerInfoComponent implements OnInit {

  
  sellerId:any;
  sellerDetails:any;
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
        this.sellerId = params['id'];
        console.log('this.sellerId',this.sellerId)
        this.getDealerDetails();
      });
    }
  }

  getDealerDetails(){
    const url = 'api/admin/sellers/view/' + this.sellerId;
    this.http.get(url).subscribe(async (data: any) => {
      this.sellerDetails = data;
    }, (err:any) => {

    });
  }

  ngOnDestroy(){
     if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
     }
  }
}
