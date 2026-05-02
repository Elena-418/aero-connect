import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SearchParams } from '../../../core/models/flight.model';
import { output,input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GoBack } from '../../../shared/directives/goBack';
@Component({
  selector: 'app-header',
  imports: [ MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  DatePipe, GoBack],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private _router = inject(Router);
  private _route=inject(ActivatedRoute);

searchParams=input.required<SearchParams>();
goBackOutput = output<void>();
 
goBack(): void {
   this.goBackOutput.emit();
    
  }
}
