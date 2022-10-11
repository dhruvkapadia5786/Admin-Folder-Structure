import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attributes-view',
  templateUrl: './attributes-view.component.html',
  styleUrls: ['./attributes-view.component.scss']
})
export class AttributesViewComponent implements OnInit {

  public categoryId: any;
  constructor(private route: ActivatedRoute){
      this.categoryId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
  }

}
