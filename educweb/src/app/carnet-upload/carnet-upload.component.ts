import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

export class Upload{
  $key: string;
  file: File;
  name: string;
  url: string;
  progess: number;
  createdAt: Date = new Date();

  constructor(file:File){
    this.file = file;
  }
}

@Component({
  selector: 'app-carnet-upload',
  templateUrl: './carnet-upload.component.html',
  styleUrls: ['./carnet-upload.component.css']
})
export class CarnetUploadComponent implements OnInit {
  currentUpload;
  userUrl = '';
  notes = '';


  constructor(private storage: AngularFireStorage, private App: AppComponent,private authService: AuthServiceService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.delay(500).then(any =>{
      let user = this.App.User;
      this.notes = this.App.User['dir'];
      console.log(user.carnetUrl, this.notes);
      if(user.carnetUrl != undefined){
        this.userUrl = user.carnetUrl;
      }
    })    
  }

  detectFiles(event){
    console.log(this.App.User)
    console.log(event.target.files['length'])
    if(event.target.files['length'] != 0)
    {
      let file = event.target.files[0];
      this.currentUpload = new Upload(file);
      console.log(event)
      this.storage.upload('/ProfCarnets/'+this.App.User.mail+'.png',this.currentUpload.file).then(response =>{
        let url = this.storage.ref('/ProfCarnets/'+this.App.User.mail+'.png').getDownloadURL();
        url.subscribe(result =>{
          console.log(result);
          this.userUrl = result;
          this.authService.updateUserCarnet(this.App.User.uid, this.userUrl).then(result =>{
            console.log(result);
            this.snack.open('Su imagen fue cargada y enviada.', '', {duration: 2500})
          });
        })
      });
    }
    
    
  }


  
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }
}
