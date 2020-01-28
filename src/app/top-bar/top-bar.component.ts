import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

   title:string = "Poll Portal" ;

   ngOnInit(){
    console.log("top-bar component init")
   }

}