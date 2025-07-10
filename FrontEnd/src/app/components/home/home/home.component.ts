import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const rolId = this.authService.getUserRol();

    switch (rolId) {
      case '1':
        this.router.navigate(['/administrador/home']);
        break;
      case '2':
        this.router.navigate(['/almacen/home']);
        break;
      default:
        this.router.navigate(['/not-found']);
        break;
    }
  }
}
