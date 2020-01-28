import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QuestionListComponent } from './q-list.component';
import { HttpClientModule } from '@angular/common/http';
import {QuestionListService} from './q-list.service';
import {DataViewModule} from 'primeng/dataview';
import {ButtonModule} from 'primeng/button';


@NgModule({
  declarations: [
    QuestionListComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DataViewModule,
    ButtonModule
  ],
  providers: [QuestionListService]
})
export class QuestionListModule { }
