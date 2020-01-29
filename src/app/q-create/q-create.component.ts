import { Component, OnInit } from '@angular/core';
import { QuestionCreateService } from './q-create.service';
import { Question } from '../models/question';



@Component({
    selector: 'q-create',
    templateUrl: './q-create.component.html',
    styleUrls: ['./q-create.component.css']
})
export class QuestionCreateComponent implements OnInit {

    msgs: any[] = [];
    question:string;
    choices:string;

    constructor(private qaService: QuestionCreateService) {

    }

    ngOnInit() {

        console.log("init Questions create module");

    }
    addQuestion(){

        if(!this.question){
            this.logMessage("error","Question is empty","");
            return;
        }
        if(!this.choices){
            this.logMessage("error","Choices is empty","");
            return;
        }
        this.qaService.addQuestion(this.question,this.choices).subscribe(suc=>{
            this.logMessage('success', "Question Added", "");
        },err=>{
            this.logMessage('error', "Operation failed,please try later", "");
        });

    }

    logMessage(severity, summary, detail) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });



    }
}