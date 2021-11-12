import { Platform } from '@angular/cdk/platform';
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,  private splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }

  initializeApp(){
    this.splashScreen.hide();
    // this.platform.ready().then(() =>{
    //   this.splashScreen.hide();
    // })
  }

  
}
