import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../../services/loading/loading.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-loading-spinner',
  imports: [ProgressSpinnerModule,CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  isLoading: boolean = true;
  constructor(private loadindService: LoadingService) { }

  ngOnInit(): void {
    this.loadindService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
