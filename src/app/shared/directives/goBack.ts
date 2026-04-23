import { Directive, HostListener, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Directive({
  selector: '[appGoBack]',
})
export class GoBack {

  @Input() fallbackRoute: string = '/';

  constructor(
    private location: Location,
    private router: Router
  ) {}

  @HostListener('click')
  onClick() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([this.fallbackRoute]);
    }
  }
}
