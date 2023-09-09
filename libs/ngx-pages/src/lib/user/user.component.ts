import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ysera-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styles: [],
})
export default class UserComponent implements OnInit {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.paramMap.subscribe(console.log);
  }
}
