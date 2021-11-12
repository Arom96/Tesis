import { AfterContentInit, Component } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AuthService, Usuario } from '../services/auth.service';



@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements AfterContentInit{

  constructor(private token: AuthService) {
  }

  ngAfterContentInit(){
    PushNotifications.addListener('registration',(e:Token)=>{
      this.token.user$.subscribe((user)=>{
        this.token.actualizartoken(e.value, user.uid);    
      })
      
    })
  }



}


