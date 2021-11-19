import { BaseModel } from "./BaseModel";
import { City } from "./City";
import { State } from "./State";


export default class Address extends BaseModel {
    addressLine1!: string;
    addressLine2!: string;
    zipcode!: string;
    state!: State;
    city!:City;
    type!: string;
    cityName!:string;
    // stateName!: string;
    // countryName!: string;

    constructor() {
        super();
        this.state=new State();
        this.city=new City();
        // this.state = 0;
    }
}