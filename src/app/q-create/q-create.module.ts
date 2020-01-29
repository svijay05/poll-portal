import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {QuestionCreateService} from './q-create.service';
import {QuestionCreateComponent} from './q-create.component';
import {DataViewModule} from 'primeng/dataview';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import {ProgressBarModule} from 'primeng/progressbar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [
    QuestionCreateComponent, 
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
    InputTextModule,
    MessageModule
  ],
  providers: [QuestionCreateService]
})
export class QuestionCreateModule { }
