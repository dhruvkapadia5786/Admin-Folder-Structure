import { Injectable, ViewContainerRef } from '@angular/core';
import * as moment from "moment-timezone";
import Hashids from 'hashids';
import { FormGroup } from '@angular/forms';

@Injectable()
export class Helper {

    public IST_DATE_TIME_FORMAT = 'DD-MM-YYYY hh:mm:ss A';
    public IST_DATE_FORMAT = 'DD-MM-YYYY';

    calculateAge(dateOfBirth: string, format: string = "DD-MM-YYYY") {
        var curDate = moment();
        var bDate = moment(dateOfBirth, format);
        return curDate.diff(bDate, 'years');
    }

    public getFormattedDateFromUnixTimestamp(timestamp:number,format=this.IST_DATE_TIME_FORMAT){
      return moment.unix(timestamp).local().format(format);
    }

    getFormattedDate(date: string, format: string = 'DD-MM-YYYY') {
        return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format(format);
    }

    getInINRFormat(currency: string, data: number) {
        switch (currency) {
            case 'INR':
                return Number(data).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            default:
                return "";
        }
    }

    getLocalDate(date: Date | string, format?: string) {
        if (format) {
            if (moment(date).isValid()) {
                return moment.utc(date).tz("Asia/Culcutta").format(format);
            }
        }
        else {
            if (moment(date).isValid()) {
                return moment.utc(date).tz("Asia/Culcutta");
            }
        }
        return date;
    }

    public getUTCtoLocalDateTime(date: any, format: string = this.IST_DATE_TIME_FORMAT) {
        if (date != null && moment(date).isValid()) {
            return moment.utc(date).local().format(format);
        } else {
            return date;
        }
    }

    /* DIDN'T GIVE EXPECTED OUTPUT */
    public getUserLocalDate(date: any) {
        if (date != null && moment(date).isValid()) {
            return moment(date).format(this.IST_DATE_TIME_FORMAT);
        } else {
            return date;
        }
    }

    /* DIDN'T GIVE EXPECTED OUTPUT */
    public getESTDateTime(date: any) {
        if (date != null && moment(date).isValid()) {
            return moment.tz(date, 'Asia/Calcutta').format(this.IST_DATE_TIME_FORMAT);
        } else {
            return date;
        }
    }

    public getESTDate(date: any) {
        if (date != null && moment(date).isValid()) {
            return moment.tz(date, 'Asia/Calcutta').format(this.IST_DATE_FORMAT);
        } else {
            return date;
        }
    }


    getBMITextBadge(bmi_text:string){
      if(bmi_text=='severely_underweight'){
         return `<span class="badge badge-pill badge-danger p-2">Severely Underweight</span>`
      }
      else if(bmi_text=='underweight'){
        return `<span class="badge badge-pill badge-warning p-2">Underweight</span>`
      }
      else if(bmi_text=='normal'){
        return `<span class="badge badge-pill badge-success p-2">Normal</span>`
      }
      else if(bmi_text=='overweight'){
        return `<span class="badge badge-pill badge-danger p-2">Overweight</span>`
      }
      else if(bmi_text=='obese'){
        return `<span class="badge badge-pill badge-danger p-2">Obese</span>`
      }
      else{
         return '';
      }
  }

  getBPTextBadge(result:string){
      if(result=='LOW'){
          return `<span class="badge badge-pill badge-danger p-2">Low</span>`
       }
       else if(result=='NORMAL'){
         return `<span class="badge badge-pill badge-success p-2">Normal</span>`
       }
       else if(result=='PREHYPERTENSION'){
         return `<span class="badge badge-pill badge-warning p-2">Pre Hypertension</span>`
       }
       else if(result=='HYPERTENSTION STAGE 1' || result=='HYPERTENSTION STAGE 2' || result=='HYPERTENSTION CRISIS'){
         return `<span class="badge badge-pill badge-danger p-2">High</span>`
       }
       else{
          return '';
       }
   }

    getUserUniqueId(id: number, type: number = 0) {
        const uniqueId = new Hashids('', 10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
        const userUniqueId = uniqueId.encode(id);
        switch (type) {
            case 1:
                return 'DR' + userUniqueId;
            case 2:
                return 'PH' + userUniqueId;
            case 3:
                return 'PT' + userUniqueId;
            case 4:
                return 'TN' + userUniqueId;
            case 5:
                return 'AR' + userUniqueId;
            default:
                return userUniqueId;
        }
    }

    /**
  * Marks all controls in a form group as touched
  * @param formGroup - The form group to touch
  */
    public markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    public getHashId(id: any) {
        const hashid = new Hashids('', 10);
        return hashid.encode(id);
    }

    public getDecodeHashId(id: any) {
        const hashid = new Hashids('', 10);
        return hashid.decode(id)[0];
    }

}
