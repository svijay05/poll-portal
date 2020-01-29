import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuestionCreateService {

    constructor(private http: HttpClient) { }
    baseUrl:string="https://polls.apiblueprint.org/questions" ;

    addQuestion(question:string,choices:string){

        var data = {question:"",choices:[]} ;
        data.question=question;
        data.choices=choices.split(",");

        return this.http.post(this.baseUrl,data) ;

    }
}
