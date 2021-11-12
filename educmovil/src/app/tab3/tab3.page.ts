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
  
  /*sendnotificacionRenta(titulo:string, autor: string, cat: string, desc: string){
          let options = {headers: new HttpHeaders({'Authorization': 'key=AAAAZ0qSvAI:APA91bG1P8an9lC-C2rTiJYUNOR_WNPH6rxWAmeZxo_Ieg4XpFMY68FZGOJCx4G_dMgkIZsht9vEZy2rIGXXrBkl2pBaZcqlMuAsoJopLfJ27RLwPiZqVSYbCsDt_WrNrRBwPnZPkYxg',
           'Content-Type': 'application/json' })}
           //estructura de notificacion.
          let notification = {
            "notification": {
              "title": titulo,
              "body":"Nueva Lectura" + desc + "\n",
              "click_action": "FCM_PLUGIN_ACTIVITY",
              "sound": "default",
              "icon": "ic_launcher"
            }, "data": {
              
            },
            "to": this.token
          }
          let url = 'https://fcm.googleapis.com/fcm/send';
          this.http.post(url, notification, options).subscribe(data => {
            console.log('enviado');
        }, error => {
            console.log('error saving token', error);
        });
  }*/

}
