import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl,FormArray, FormBuilder,Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UploadMediaModalService } from './upload-media-modal.service';

@Component({
  selector: 'app-upload-media-modal',
  templateUrl: './upload-media-modal.component.html',
  styleUrls: ['./upload-media-modal.component.scss']
})
export class UploadMediaModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  mediaType:string='';
  addMedia:FormGroup;
  selectedFiles:File[]=[];

  constructor(
    private fb:FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _bsModalRef:BsModalRef,
    private _uploadModalService:UploadMediaModalService){

      this.addMedia = this.fb.group({
        file_inputs: this.fb.array([])
      });

      this.addFileInput();
  }

  onMediaSubmit(isValid:boolean){
    if(isValid){
      let formVal:any=this.addMedia.value;
      this.onEventCompleted.emit({
        mediaType:this.mediaType,
        selectedFiles:this.selectedFiles,
        file_inputs:formVal.file_inputs
      });
      this.resetUploadMediaForm();
      return true;
    }else{
      return false;
    }
  }


  addFileInput() {
    this.file_inputs().push(this.newFileInput());
  }

  newFileInput(): FormGroup {
    return this.fb.group({
      'files': new FormControl('', [Validators.required]),
      'caption': new FormControl('', [Validators.required])
    });
  }

  removeFileInput(empIndex:number) {
    this.file_inputs().removeAt(empIndex);
    this.selectedFiles.splice(empIndex,1);
  }

  file_inputs(): FormArray {
      return this.addMedia.get("file_inputs") as FormArray
  }

  ngOnInit(): void {
    this.resetUploadMediaForm();
    this.mediaType=this._uploadModalService.getFormData();
  }

  closeModal(){
    this._bsModalRef.hide()
  }

  onFileChange(index:number,event:any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      this.selectedFiles[index]=file;

      reader.readAsDataURL(file);
      reader.onload = () => {
        // need to run CD since file load runs outside of zone
        this._changeDetectorRef.markForCheck();
      };
    }
  }

  resetUploadMediaForm(){
    this.mediaType='';
    this.selectedFiles=[];
    this.addMedia.reset();
    for(let i = this.file_inputs().length-1; i > 0; i--) {
      this.file_inputs().removeAt(i);
    }
  }


}
