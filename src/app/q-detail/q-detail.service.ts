import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuestionDetailService {

    constructor(private http: HttpClient) { }
    baseUrl:string="https://polls.apiblueprint.org" ;

    getQuestionDetail(id:string) {
        return this.http.get(this.baseUrl+"/questions/"+id+"?"+Date.now());

    }
    voteForChoice(choiceUrl:string){

        return this.http.post(this.baseUrl+choiceUrl,{}) ;

    }
}
