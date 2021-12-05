import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-otc-categories-view',
  templateUrl: './otc-categories-view.component.html',
  styleUrls: ['./otc-categories-view.component.scss']
})
export class OtcCategoriesViewComponent implements OnInit {

  public categoryId: any;
  constructor(private route: ActivatedRoute){
      this.categoryId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
  }

}
