import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {QuestionDetailService} from './q-detail.service';
import {QuestionDetailComponent} from './q-detail.component';
import {DataViewModule} from 'primeng/dataview';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import {ProgressBarModule} from 'primeng/progressbar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    QuestionDetailComponent, 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DataViewModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    FormsModule,
    ProgressBarModule,
    MessagesModule,
    MessageModule
  ],
  providers: [QuestionDetailService]
})
export class QuestionDetailModule { }
