import { Component } from '@angular/core';
import { Flight } from '../../../core/models/flight.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ɵInternalFormsSharedModule } from '@angular/forms';
import { max } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-flight-filters',
  imports:   [MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  ReactiveFormsModule],
  templateUrl: './flight-filters.component.html',
  styleUrl: './flight-filters.component.scss'
})
export class FlightFiltersComponent {
  flights: Flight[] = [];
 maxPrice: number | null = null;

 //se incluye los dos cuando haces form group
 form = new FormGroup({
  maxPrice: new FormControl<number | null>(null),
  sortBy: new FormControl<'price' | 'departure' | 'duration'>('price')
});

 get filteredFlights(): Flight[] {
  const { maxPrice, sortBy } = this.form.value;

  let result = [...this.flights];

  if (maxPrice !== null && maxPrice !== undefined) {
    result = result.filter(f => f.basePrice <= maxPrice);
  }

  result.sort((a, b) => {
    if (sortBy === 'price') return a.basePrice - b.basePrice;
    if (sortBy === 'departure') return a.departureDate.localeCompare(b.departureDate);
    return a.durationMinutes - b.durationMinutes;
  });

  return result;

}

}

