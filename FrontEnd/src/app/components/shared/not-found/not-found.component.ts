import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-not-found',
  imports: [CardModule, ButtonModule,DividerModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})

export class NotFoundComponent {
  constructor(private router: Router){}

  goHome(){
    this.router.navigate(['/']);
  }
}
