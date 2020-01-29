import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionDetailComponent } from './q-detail/q-detail.component';
import {QuestionListComponent} from './q-list/q-list.component' ;

const routes: Routes = [
  { path: '', component: QuestionListComponent },
  { path: 'view/questions/:id', component: QuestionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
