import { Injectable, inject } from '@angular/core';
import { FlightService } from '../../../core/services/flight.service';
import { Flight, SearchParams } from '../../../core/models/flight.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightSearchService {
  private _flightService = inject(FlightService);
//pasar las funciones aqui de search result componen al menos las llamadas a estas
  search(params: SearchParams): void {}
  setFilter(text: string): void {}
  setSort(sort: 'price' | 'departure' | 'duration'): void {}

  loadFlightWithAirports(flightId: string): Observable<[Flight, { code: string; city: string }[]]> {
    throw new Error('Not implemented');
  }
}
