import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class ViewobserverService {
  public isMobile: boolean = false;
  constructor( public breakpointObserver: BreakpointObserver) { 
    breakpointObserver.observe([
      '(max-width: 650px)'
    ]).subscribe(result => {
      this.isMobile = result.matches;
    })
  }

  ishandheld(){
    return this.isMobile;
  }

  getMode(){
    return this.breakpointObserver.observe([
      '(max-width: 450px)'
    ])
  }
}
