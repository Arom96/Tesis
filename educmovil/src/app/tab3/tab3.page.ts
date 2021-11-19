import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public token: string;
  Notifications = [];
  constructor(private auth: AuthService, public http: HttpClient) 
  {
    let sub = this.auth.listNots().subscribe(result =>{
      this.Notifications = []
      for(let s in result)
      {
        this.Notifications.push({desc: result[s]['desc'], cat: result[s]['cat'], autor: result[s]['autor']})
      }
      console.log(this.Notifications);
    })
  }
  
  filtercat(e: any){
    let buscar: string = e.target.value.toLowerCase();
    let sub = this.auth.listNots().subscribe(result =>{
      this.Notifications = []
        for(let s in result)
        {
          this.Notifications.push({desc: result[s]['desc'], cat: result[s]['cat'], autor: result[s]['autor']})
        }
        
        if(buscar.trim().length > 0){
          
          this.Notifications = this.Notifications.filter(e =>{
            return e.desc.toLowerCase().includes(buscar);
          });
        }

    })
    
  }

}
