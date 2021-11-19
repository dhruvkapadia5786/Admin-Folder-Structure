import { Injectable, ViewContainerRef } from '@angular/core';
import * as moment from "moment-timezone";
import Hashids from 'hashids';
import { FormGroup } from '@angular/forms';

@Injectable()
export class Helper {

    public EST_DATE_TIME_FORMAT = 'MM/DD/YYYY hh:mm:ss A';
    public EST_DATE_FORMAT = 'MM/DD/YYYY';

    calculateAge(dateOfBirth: string, format: string = "MM/DD/YYYY") {
        var curDate = moment();
        var bDate = moment(dateOfBirth, format);
        return curDate.diff(bDate, 'years');
    }

    public getFormattedDateFromUnixTimestamp(timestamp:number,format=this.EST_DATE_TIME_FORMAT){
      return moment.unix(timestamp).local().format(format);
    }

    getFormattedDate(date: string, format: string = 'MM/DD/YYYY') {
        return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format(format);
    }

    getInDollarFormat(currency: string, data: number) {
        switch (currency) {
            case 'USD':
                return Number(data).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            default:
                return "";
        }
    }

    getLocalDate(date: Date | string, format?: string) {
        if (format) {
            if (moment(date).isValid()) {
                return moment.utc(date).tz("America/New_York").format(format);
            }
        }
        else {
            if (moment(date).isValid()) {
                return moment.utc(date).tz("America/New_York");
            }
        }
        return date;
    }

    public getUTCtoLocalDateTime(date: any, format: string = this.EST_DATE_TIME_FORMAT) {
        if (date != null && moment(date).isValid()) {
            return moment.utc(date).local().format(format);
        } else {
            return date;
        }
    }

    /* DIDN'T GIVE EXPECTED OUTPUT */
    public getUserLocalDate(date: any) {
        if (date != null && moment(date).isValid()) {
            return moment(date).format(this.EST_DATE_TIME_FORMAT);
        } else {
            return date;
        }
    }

    /* DIDN'T GIVE EXPECTED OUTPUT */
    public getESTDateTime(date: any) {
        if (date != null && moment(date).isValid()) {
            return moment.tz(date, 'America/New_York').format(this.EST_DATE_TIME_FORMAT);
        } else {
            return date;
        }
    }

    public getESTDate(date: any) {
        if (date != null && moment(date).isValid()) {
            return moment.tz(date, 'America/New_York').format(this.EST_DATE_FORMAT);
        } else {
            return date;
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
