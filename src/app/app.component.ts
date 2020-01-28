
import { Component,OnInit } from '@angular/core';
import {TopBarComponent} from './top-bar/top-bar.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'Polls App';
  ngOnInit() {
    console.log("app init");
  }
  
}
