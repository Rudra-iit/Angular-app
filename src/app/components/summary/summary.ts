import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class SummaryComponent {
  dataService = inject(DataService);
  // No loadCountries() call here — it reuses whatever PostsComponent already fetched
}