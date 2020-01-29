import { Component, OnInit } from '@angular/core';
import { QuestionDetailService } from './q-detail.service';
import { Question } from '../models/question';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'q-detail',
    templateUrl: './q-detail.component.html',
    styleUrls: ['./q-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

    question: Question = { question: "", published_at: "", url: "", choices: [] };
    question_id: string;
    selectedChoiceLink: string;
    totalVotes: number = 0;
    msgs: any[] = [];

    constructor(private qdService: QuestionDetailService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {

        this.question_id = this.route.snapshot.params["id"];
        console.log("q detail init , question id=" + this.question_id);
        this.loadQuestionDetails();

    }

    loadQuestionDetails() {
        this.qdService.getQuestionDetail(this.question_id).subscribe((res: Question) => {
            this.question = res;
            console.log(this.question);
            this.totalVotes=0;
            this.question.choices.forEach(c => {
                this.totalVotes = this.totalVotes + c.votes;
            });

        });

    }


    vote(event) {

        if (!this.selectedChoiceLink) {
            this.logMessage('error', "Please choose an option", "");
            return;
        }

        this.msgs = [];

        this.qdService.voteForChoice(this.selectedChoiceLink).subscribe(succ => {

            this.logMessage('success', "Your vote submitted", "");
            setTimeout(() => {
                this.loadQuestionDetails();
            }, 1000);

        }, err => {

            this.logMessage('error', "Vote submission failes,please try later", "");

        });


    }

    logMessage(severity, summary, detail) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });



    }
}