import { FlightService } from './../services/flight.service';
import { RedirectCommand, ResolveFn } from '@angular/router';
import { Flight } from '../models/flight.model';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const bookingResolver: ResolveFn<Flight> = (route, state) => {
 route.paramMap.get('id');

 const flightService=inject(FlightService);
const router

 return flightService.getById(route.paramMap.get('id')!).pipe(
  //map de la dto
  catchError(error=>{
    console.log(error);
    return of new RedirectCommand(Router.parseUrl('/home'));
  }
  )
)
};
