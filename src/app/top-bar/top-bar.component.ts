import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  title: string = "Poll Portal";
  constructor(private router: Router) {

  }

  ngOnInit() {
    console.log("top-bar component init")
  }

  navHome() {
    this.router.navigateByUrl('/');
  }
  navCreate() {
    this.router.navigateByUrl('/questions/create');
  }
}