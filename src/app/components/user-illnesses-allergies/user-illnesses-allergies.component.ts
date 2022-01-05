import { Component, OnChanges, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserOrderIllnesses, UserOrderAllergies } from '../../models/admin/UserOrderDetails';

@Component({
  selector: 'app-user-illnesses-allergies',
  templateUrl: './user-illnesses-allergies.component.html',
  styleUrls: ['./user-illnesses-allergies.component.scss']
})
export class UserIllnessesAllergiesComponent implements OnChanges {

  @Input() userId: string;
  @Input() orderId: string;
  public illnesses: UserOrderIllnesses[] = [];
  public allergies: UserOrderAllergies[] = [];
  constructor(
    public http: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    const userIdVal = changes.userId.currentValue;
    this._getUserIllnesses(userIdVal);
    this._getUserAllergies(userIdVal)
  }
  private _getUserIllnesses(userId) {
    const url = 'api/orders/getUserLastOrderIllnesses?user_id=' + userId;
    this.http.post(url, {}).subscribe(
      (data: UserOrderIllnesses[]) => {
        if (data.length) {
          this.illnesses = data;
        } else {
          this.illnesses = [];
        }
        this._changeDetectorRef.detectChanges();
      },
      err => {

        this._changeDetectorRef.detectChanges();
      }
    );
  }
  private _getUserAllergies(userId) {
    const url = 'api/orders/getUserLastOrderAllergies?user_id=' + userId;
    this.http.post(url, {}).subscribe(
      (data: UserOrderAllergies[]) => {
        if (data.length) {
          this.allergies = data;
        } else {
          this.allergies = [];
        }
        this._changeDetectorRef.detectChanges();
      },
      err => {

        this._changeDetectorRef.detectChanges();
      }
    );
  }
}
