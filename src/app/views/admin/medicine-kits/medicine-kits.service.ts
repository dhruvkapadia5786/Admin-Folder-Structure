import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject }    from 'rxjs';

@Injectable()
export class MedicineKitsService {
    constructor(private _http: HttpClient) { }
    private medicineKitsSource = new Subject<any>();

    // Observable string streams
    medicineKitsPublished$ = this.medicineKitsSource.asObservable();

    // Service message commands
    publishMedicineKits(event: any) {
        this.medicineKitsSource.next(event);
    }
}
