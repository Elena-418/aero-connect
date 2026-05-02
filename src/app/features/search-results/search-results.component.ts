import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../core/services/flight.service';
import { Flight, SearchParams } from '../../core/models/flight.model';

import { HeaderComponent } from '../flights/header/header.component';


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
  
    HeaderComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _flightService = inject(FlightService);

  
  isLoading = false;
  error: string | null = null;
  searchParams!: SearchParams;

  // Filtros inline (estos irán a FlightFiltersComponent)
 
  ngOnInit(): void {
    const qp = this._route.snapshot.queryParams;
    this.searchParams = {
      origin: qp['origin'] ?? '',
      destination: qp['destination'] ?? '',
      date: qp['date'] ?? '',
      passengers: Number(qp['passengers'] ?? 1),
    };
    this._loadFlights();
  }

  private _loadFlights(): void {
    this.isLoading = true;
    this.error = null;
    this._flightService.search(this.searchParams).subscribe({
      next: (flights) => {
        this.flights = flights;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se han podido cargar los vuelos. Inténtalo de nuevo.';
        this.isLoading = false;
      },
    });
  }

  bookFlight(flight: Flight): void {
    this._router.navigate(['/booking', flight.id]);
  }
//en la card en forma de pipe
  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }
goBack():void{
 this._router.navigate(['/']);
}
  
}
