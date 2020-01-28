import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionListComponent } from './q-list/q-list.component';


const routes: Routes = [
  { path: '', component: QuestionListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
