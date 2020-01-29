import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarModule } from './top-bar/top-bar.module';
import { QuestionListModule } from './q-list/q-list.module';
import { QuestionDetailModule } from './q-detail/q-detail.module' ;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TopBarModule,
    QuestionListModule,
    QuestionDetailModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
