import { Component, OnInit ,Input,OnChanges} from '@angular/core';

@Component({
  selector: 'app-quiz-answers',
  templateUrl: './quiz-answers.component.html',
  styleUrls: ['./quiz-answers.component.scss']
})
export class QuizAnswersComponent implements OnInit,OnChanges {
  @Input() details:any;
  @Input() maxHeight:number=700;
  formattedQuestionAnswers:any[]=[];

  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges(){
    this.formattedQuestionAnswers = this.getFormattedQuestionAnswers(this.details);
  }

  getFormattedQuestionAnswers(questions:any[]){
    let formattedQuestionAnswerArray:any[]=[];
    questions.forEach((question:any,index:number)=>{
     let questionObj:any={};
     questionObj.id = question.id;
     questionObj.text = question.text;
     if(question.type=='input'){

       questionObj.answer = question.answer;

       if(formattedQuestionAnswerArray.filter((item:any)=>item.id==question.id).length==0){
            formattedQuestionAnswerArray.push(questionObj);
       }

       if(question.has_subquestions && question.subquestions){
            question.subquestions.forEach((subquestion:any,index:number)=>{
              if(subquestion.type=='input'){
                  let subQobj={
                    id:subquestion.id,
                    text:subquestion.text,
                    answer:subquestion.answer
                  }
                  if(formattedQuestionAnswerArray.filter((item:any)=>item.id==subquestion.id).length==0){
                    formattedQuestionAnswerArray.push(subQobj);
                  }
              }else if(subquestion.type=='single'){
                let checkedChoice = subquestion.choices.find((choice:any)=>choice.is_checked==true);
                let subq_answer = checkedChoice && checkedChoice.label ? checkedChoice.label:'';
                let subQobj={
                  id:subquestion.id,
                  text:subquestion.text,
                  answer:subq_answer
                }
                if(formattedQuestionAnswerArray.filter((item:any)=>item.id==subquestion.id).length==0){
                  formattedQuestionAnswerArray.push(subQobj);
                }
              }else{

              }
            });
       }

     }else if(question.type=='single'){
        let checkedChoice = question.choices.find((choice:any)=>choice.is_checked==true);
        questionObj.answer = checkedChoice && checkedChoice.label ? checkedChoice.label:'';
        formattedQuestionAnswerArray.push(questionObj);

          // finding subquestion from question
          question.choices.forEach((choice:any,choiceIndex:number)=>{
            if(choice.is_checked && choice.has_subquestions && choice.subquestions.length>0){
                  let subquestions =  choice.subquestions;
                  subquestions.forEach((subquestion:any,index:number)=>{
                    if(subquestion.type=='input'){
                        let subQobj={
                          id:subquestion.id,
                          text:subquestion.text,
                          answer:subquestion.answer
                        }
                        if(formattedQuestionAnswerArray.filter((item:any)=>item.id==subquestion.id).length==0){
                          formattedQuestionAnswerArray.push(subQobj);
                        }
                    }else if(subquestion.type=='single'){
                      let checkedChoice = subquestion.choices.find((choice:any)=>choice.is_checked==true);
                      let subq_answer = checkedChoice && checkedChoice.label ? checkedChoice.label:'';
                      let subQobj={
                        id:subquestion.id,
                        text:subquestion.text,
                        answer:subq_answer
                      }
                      if(formattedQuestionAnswerArray.filter((item:any)=>item.id==subquestion.id).length==0){
                        formattedQuestionAnswerArray.push(subQobj);
                      };
                    }else{

                    }
                  });
            }
          });

     }
     else if(question.type=='group_multiple_radio'){
      questionObj.answers = [];
      question.items.forEach((item:any,item_index:number)=>{
          let checkedChoice = item.choices.find((choice:any)=>choice.is_checked==true);
          let label = checkedChoice?checkedChoice.label:'';
          let ans={
             text:item.name,
             choice:label
          }
          questionObj.answers.push(ans);
      });
      if(formattedQuestionAnswerArray.filter((item:any)=>item.id==question.id).length==0){
        formattedQuestionAnswerArray.push(questionObj);
      }
    }else if(question.type=='group_multiple_checkbox'){
      questionObj.answers = [];
      question.items.forEach((item:any,item_index:number)=>{
          let checkedChoices = item.choices.filter((choice:any)=>choice.is_checked==true);
          let ans={
            text:item.name,
            choice:checkedChoices.map((cc:any)=>cc.label).join(',')
          }
         questionObj.answers.push(ans);
      });

      if(formattedQuestionAnswerArray.filter((item:any)=>item.id==question.id).length==0){
        formattedQuestionAnswerArray.push(questionObj);
      }
    }
     else{

     }
    });
   return formattedQuestionAnswerArray;
  }

}
