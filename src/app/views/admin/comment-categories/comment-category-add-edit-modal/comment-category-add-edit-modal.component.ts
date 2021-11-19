import { ChangeDetectorRef, EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { CommentCategoryAddEditModalService } from './comment-category-add-edit-modal.service';

@Component({
  selector: 'app-comment-category-add-edit-modal',
  templateUrl: './comment-category-add-edit-modal.component.html',
  styleUrls: ['./comment-category-add-edit-modal.component.scss']
})
export class CommentCategoryAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  commentCategoryForm: FormGroup;

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _hcAddEditModalService: CommentCategoryAddEditModalService
  ) {
    this.commentCategoryForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, [])
    });
  }

  get id() { return this.commentCategoryForm.get('id'); }
  get name() { return this.commentCategoryForm.get('name'); }
  get is_active() { return this.commentCategoryForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._hcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.commentCategoryForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        is_active:details.data.is_active
      });
    }
  }

  async saveCommentCategory(formValid:boolean){
    if(formValid){
      const formData: any = this.commentCategoryForm.value;
      if(this.modalEvent == 'ADD'){
        let created= await this._hcAddEditModalService.addNewCommentCategory(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._hcAddEditModalService.editCommentCategory(this.commentCategoryForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.commentCategoryForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.commentCategoryForm);
    }
  }
  closeModal(){
    this._bsModalRef.hide();
  }
}
