import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './Services/auth-service.service';
import { ViewobserverService } from './Services/viewobserver.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  User;
  usrImg;
  isLogged = false;
  title = 'educweb';
  loginSub;
  logsub;  
  public isMobile: boolean = false;

  constructor(private router: Router, private authService: AuthServiceService, private observer: ViewobserverService){}

  ngOnInit(){
    this.router.navigateByUrl('home');
    this.getCurrentUser();

    //observer to get view size 
    this.observer.getMode().subscribe(result =>{
      this.isMobile = result.matches;
    })
  }

  //cambia la navegacion a login/register con parametros
  navigateWithParams(param){
    this.router.navigate(['/login'], { queryParams: { params: param } });
  }

  getCurrentUser(){
    this.logsub = this.authService.isAuth().subscribe( user => {
      if(user){
        this.loginSub = this.authService.getUserData(user.uid).subscribe(result =>{
          this.User = result;
          this.usrImg = result.usrUrl;
          this.isLogged = true;
          this.authService.updateUserRoles(result.role);
          let subAuth2 = this.authService.getUserData(user.uid).subscribe(result =>{
            if(result.role == 'profesor')
            {
              if(!result.enabled)
              {
                this.router.navigateByUrl('carnet-upload');
              }
              else
              {
                this.router.navigateByUrl('categories');
              }
            }
            else
            {
              if(result.enabled)
                {
                  if(result.role == 'admin')
                  {
                    this.router.navigateByUrl('profile')
                  }
                  else
                  {
                    this.router.navigateByUrl('categories');
                  }
                  
                }
            }
            
            subAuth2.unsubscribe();
          });
          
        })
        
      }
      else
      {
        console.log('not logged');
      }
    })
  }

  logOutUser(){
    //this.logsub.unsubscribe();
    this.loginSub.unsubscribe();
    this.isLogged = false;
    this.User = {};
    this.authService.logoutUser();
    sessionStorage.removeItem('tokenK');
    sessionStorage.removeItem('displayName');
    sessionStorage.removeItem('userName');
    this.navigateWithParams('login');
    console.log('logged out')
  }

}
