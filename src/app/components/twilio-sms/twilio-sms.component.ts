import { Component, OnChanges, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-twilio-sms',
  templateUrl: './twilio-sms.component.html'
})
export class TwilioSmsComponent implements OnInit, OnChanges {

	@Input() patientId: any;
	@Input() eventId: any;
  @Input() eventType:string='';
	@Input() orderNumberText: any;
  @Input() defaultText: any;
  @Input() userType: string='';

	sending_sms:boolean=false;
	text_msg:string='Teledaddy';

	constructor(
		private _http: HttpClient,
		private _toastr: Toastr,
		public _changeDetectorRef: ChangeDetectorRef){

  }

  ngOnChanges() {}
  ngOnInit() {
    this.text_msg = this.defaultText;
  }

  sendSMSToPatient(){
    if(this.text_msg.trim().length>0){
        this.sending_sms = true;
        let url: string='';
        if (this.userType == 'TECHNICIAN') {
          url = 'api/v1/technician/send_sms';
        } else if (this.userType == 'DOCTOR') {
          url = 'api/v1/doctor/send_sms';
        }
        this._http.post(url, {
            patient_id: this.patientId,
            text_msg: this.text_msg,
            order_id: this.eventId,
            event_type:this.eventType
        }).subscribe((data: any) => {
          this.sending_sms = false;
          this.text_msg = this.defaultText;
          this._toastr.showSuccess('SMS has been successfully sent to patient');
        },
        err => {

          this._toastr.showError('Unable to send SMS to patient');
        });
    }
  }
}
