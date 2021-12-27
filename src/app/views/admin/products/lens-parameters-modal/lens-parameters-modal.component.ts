import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConstants } from 'src/app/constants/AppConstants';
import { HttpClient } from '@angular/common/http';
import { LensParametersModalService } from './lens-parameters-modal.service';

@Component({
  selector: 'app-lens-parameters-modal',
  templateUrl: './lens-parameters-modal.component.html',
  styleUrls: ['./lens-parameters-modal.component.scss']
})
export class LensParametersModalComponent implements OnInit {

  parameterTypes=AppConstants.parameterTypes;
  negativePowerDefaultOptions=AppConstants.negativePowerDefaultOptions;
  positivePowerDefaultOptions= AppConstants.positivePowerDefaultOptions;
  cylinderDefaultOptions= AppConstants.cylinderDefaultOptions;
  diameterDefaultOptions= AppConstants.diameterDefaultOptions;
  basecurveDefaultOptions = AppConstants.basecurveDefaultOptions;
  materialsDefaultOptions =AppConstants.materialsDefaultOptions;

  colorsList:any[]=[];
  selectedCylinderOptions:any=[];
  selectedDiameterOptions:any=[];
  selectedBasecurveOptions:any=[];
  selectedPowersOptions:any=[];
  selectedAddPowersOptions:any=[];
  selectedColorOptions:any=[];
  selectedDrugIndexForModal!:number|null;
  selectedParamNameForModal:string|null='';

  @Output() onApplySelected: EventEmitter<any> = new EventEmitter();

  constructor(
    private _http:HttpClient,
    private _bsModalRef:BsModalRef,
    private _cdr:ChangeDetectorRef,
    private _lensParametersModalService:LensParametersModalService){

  }

  ngOnInit(): void {
    let data = this._lensParametersModalService.getFormData();
     this.colorsList = data.colorsList;
     this.selectedDrugIndexForModal = data.index;
     this.selectedParamNameForModal = data.parameter;
  }


  addSelectedValueForParameter(parameterName:string){
    if(parameterName=='CYLINDER'){
      this.onApplySelected.emit({index:this.selectedDrugIndexForModal,parameter:parameterName,options:this.selectedCylinderOptions});
   }
   else if(parameterName=='POWER'){
      this.onApplySelected.emit({index:this.selectedDrugIndexForModal,parameter:parameterName,options:this.selectedPowersOptions});
   }
   else if(parameterName=='BASE_CURVE'){
      this.onApplySelected.emit({index:this.selectedDrugIndexForModal,parameter:parameterName,options:this.selectedBasecurveOptions});
   }
   else if(parameterName=='DIAMETER'){
      this.onApplySelected.emit({index:this.selectedDrugIndexForModal,parameter:parameterName,options:this.selectedDiameterOptions});
   }
   else if(parameterName=='COLOR'){
     this.onApplySelected.emit({index:this.selectedDrugIndexForModal,parameter:parameterName,options:this.selectedColorOptions});
   }
   else{

   }
   this.closeModal();
  }

  handleChangeParameterOptionsFromModal(event:any,value:any,parameterName:string){
   let checked = event.target.checked;
    if(parameterName=='CYLINDER'){
        let indexFound= this.selectedCylinderOptions.findIndex((item:any)=>item==value.toString());
        if(checked){
          indexFound==-1? this.selectedCylinderOptions.push(value.toString()): this.selectedCylinderOptions.splice(indexFound,1);
        }else{
          indexFound!=-1? this.selectedCylinderOptions.splice(indexFound,1):'';
        }
    }
    else if(parameterName=='POWER'){
      let indexFound= this.selectedPowersOptions.findIndex((item:any)=>item==value.toString());
      if(checked){
        indexFound==-1? this.selectedPowersOptions.push(value.toString()): this.selectedPowersOptions.splice(indexFound,1);
      }else{
        indexFound!=-1? this.selectedPowersOptions.splice(indexFound,1):'';
      }
    }
    else if(parameterName=='BASE_CURVE'){
      let indexFound= this.selectedBasecurveOptions.findIndex((item:any)=>item==value.toString());
      if(checked){
        indexFound==-1? this.selectedBasecurveOptions.push(value.toString()): this.selectedBasecurveOptions.splice(indexFound,1);
      }else{
        indexFound!=-1? this.selectedBasecurveOptions.splice(indexFound,1):'';
      }
    }
    else if(parameterName=='DIAMETER'){
      let indexFound= this.selectedDiameterOptions.findIndex((item:any)=>item==value.toString());
      if(checked){
        indexFound==-1? this.selectedDiameterOptions.push(value.toString()): this.selectedDiameterOptions.splice(indexFound,1);
      }else{
        indexFound!=-1? this.selectedDiameterOptions.splice(indexFound,1):'';
      }
    }
    else if(parameterName=='ADD_POWER'){
      let indexFound= this.selectedAddPowersOptions.findIndex((item:any)=>item==value.toString());
      if(checked){
        indexFound==-1? this.selectedAddPowersOptions.push(value.toString()): this.selectedAddPowersOptions.splice(indexFound,1);
      }else{
        indexFound!=-1? this.selectedAddPowersOptions.splice(indexFound,1):'';
      }
    }
    else if(parameterName=='COLOR'){
      let indexFound= this.selectedColorOptions.findIndex((item:any)=>item==value.toString());
      if(checked){
        indexFound==-1? this.selectedColorOptions.push(value.toString()): this.selectedColorOptions.splice(indexFound,1);
      }else{
        indexFound!=-1? this.selectedColorOptions.splice(indexFound,1):'';
      }
    }
    else{

    }
    this._cdr.detectChanges();
  }

  checkParameterIsChecked(value:any,parameterName:string){
     if(parameterName=='CYLINDER'){
       return this.selectedCylinderOptions.includes(value.toString());
     }
     else if(parameterName=='POWER'){
       return this.selectedPowersOptions.includes(value.toString());
     }
     else if(parameterName=='BASE_CURVE'){
       return this.selectedBasecurveOptions.includes(value.toString());
     }
     else if(parameterName=='DIAMETER'){
      return this.selectedDiameterOptions.includes(value.toString());
     }
     else if(parameterName=='COLOR'){
      return this.selectedColorOptions.includes(value.toString());
     }
     else if(parameterName=='ADD_POWER'){
      return this.selectedAddPowersOptions.includes(value.toString());
     }
     else{
    }
  }

  handleSelectAllParametersFromModal(event:any,parameterName:string){
      let checked = event.target.checked;
      if(parameterName=='CYLINDER'){
        if(checked){
          this.selectedCylinderOptions = this.cylinderDefaultOptions.slice();
        }else{
          this.selectedCylinderOptions=[];
        }
      }
      else if(parameterName=='POWER'){
        if(checked){
          this.selectedPowersOptions= [...this.negativePowerDefaultOptions.slice(),...this.positivePowerDefaultOptions.slice()]
        }else{
          this.selectedPowersOptions=[];
        }
      }
      else if(parameterName=='BASE_CURVE'){
        if(checked){
          this.selectedBasecurveOptions = this.basecurveDefaultOptions.slice();
        }else{
          this.selectedBasecurveOptions=[];
        }
      }
      else if(parameterName=='DIAMETER'){
        if(checked){
          this.selectedDiameterOptions = this.diameterDefaultOptions.slice();
        }else{
          this.selectedDiameterOptions=[];
        }
      }
      else if(parameterName=='COLOR'){
        if(checked){
          let colorListData=this.colorsList.slice();
          let colorNames = colorListData.map((item:any)=>item.name);
          this.selectedColorOptions = colorNames;
        }else{
          this.selectedColorOptions=[];
        }
      }
      else if(parameterName=='ADD_POWER'){
        if(checked){
          this.selectedAddPowersOptions= [];
        }else{
          this.selectedAddPowersOptions=[];
        }
      }
      else{

      }
      this._cdr.detectChanges();
  }


  closeModal(){
    this.selectedCylinderOptions=[];
    this.selectedDiameterOptions=[];
    this.selectedBasecurveOptions=[];
    this.selectedPowersOptions=[];
    this.selectedDrugIndexForModal=null;
    this.selectedParamNameForModal=null;
    this._bsModalRef.hide();
  }

}
