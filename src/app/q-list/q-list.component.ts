import { Component,OnInit } from '@angular/core';
import {QuestionListService} from './q-list.service';
import { Question } from '../models/question';
import {Router} from '@angular/router';


@Component({
  selector: 'q-list',
  templateUrl: './q-list.component.html',
  styleUrls: ['./q-list.component.css']
})
export class QuestionListComponent implements OnInit {

  questions:Question[] ;

  constructor(private qlService: QuestionListService,private router: Router) { 

  }

  ngOnInit() {
    console.log("q list init");
    this.qlService.getQuestionsList().subscribe((res: Question[])=>{
      console.log(res);
      this.questions = res;
    });

  }

  loadData(event) {
    console.log(event);
    //event.first = First row offset
    //event.rows = Number of rows per page
}

vote(event,question:Question){
  this.router.navigateByUrl('/view/'+question.url);
}
}