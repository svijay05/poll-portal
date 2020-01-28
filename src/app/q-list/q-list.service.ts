import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuestionListService {

    private questionListURL: string = "https://polls.apiblueprint.org/questions";
    constructor(private http: HttpClient) { }

    getQuestionsList() {
        return this.http.get(this.questionListURL);

    }
}
