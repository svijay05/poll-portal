import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {TopBarComponent} from './top-bar.component';

@NgModule({
  declarations: [
    TopBarComponent
  ],
  imports: [
    BrowserModule
    
  ],
  exports:[
      TopBarComponent
  ],
  providers: [],
})
export class TopBarModule { }
