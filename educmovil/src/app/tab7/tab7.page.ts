import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { stringify } from 'querystring';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
})
export class Tab7Page implements OnInit {  
  public preguntas = [];
  correctas: any = '0';
  incorrectas: string = '0';

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private auth: AuthService,
    public alertController: AlertController) { }

  ngOnInit() {
    let aciertos = this.activatedRoute.snapshot.paramMap.get('aciertos');
    let buffer = eval(this.activatedRoute.snapshot.paramMap.get("preguntas"));
    // posicion 5
    let respuestas = eval(this.activatedRoute.snapshot.paramMap.get('respuestas'));
    for(let s in buffer)
    {
      // console.log(respuestas[s],buffer[s]['correcta'] )
      
      if(respuestas[s] == buffer[s]['correcta'])
      {
        this.preguntas.push({primera: buffer[s]['primera'], segunda: buffer[s]['segunda'], tercera: buffer[s]['tercera'], cuarta: buffer[s]['cuarta'], pregunta: buffer[s]['pregunta'], correcta: buffer[s]['correcta'], desc: 'Respuesta correcta!', correct: true})
        this.correctas = (parseInt(this.correctas) + 1).toFixed(0);
      }
      else
      {
        let correctP = ''
        if(buffer[s]['correcta'] == '1')
        {
          correctP = buffer[s]['primera'];
        }
        if(buffer[s]['correcta'] == '2')
        {
          correctP = buffer[s]['segunda']
          // this.correctas = (parseInt(this.correctas) + 1).toFixed(0);

        }
        if(buffer[s]['correcta'] == '3')
        {
          correctP = buffer[s]['tercera']
          // this.correctas = (parseInt(this.correctas) + 1).toFixed(0);

        }
        if(buffer[s]['correcta'] == '4')
        {
          correctP = buffer[s]['cuarta']
          // this.correctas = (parseInt(this.correctas) + 1).toFixed(0);

        }
        this.preguntas.push({primera: buffer[s]['primera'], segunda: buffer[s]['segunda'], tercera: buffer[s]['tercera'], cuarta: buffer[s]['cuarta'], pregunta: buffer[s]['pregunta'], correcta: buffer[s]['correcta'], desc: 'La respuesta correcta es: '+correctP, correct: false})
        this.incorrectas = (parseInt(this.incorrectas) + 1).toFixed(0);
      }
      
    }
    // console.log(this.preguntas)
  }
  

  ionViewDidLeave() {
    for(let s in this.preguntas)
    {
      let elem = (document.getElementById(s) as HTMLIonRadioElement)
      if(elem != null)
      {
        elem.parentNode.removeChild(elem);
      }
      
    }

  }

  async showResults(){
    //console.log(this.correctas);
    //console.log(this.incorrectas);

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tu puntuación es:',
      message: ((this.correctas)*10) + ' / ' + (this.preguntas.push(Number(Array[0]))-1)*10  + 
      ' Por ' + this.correctas + ' respuesta(s) correcta(s)' + ' de ' + (this.preguntas.push(Number(Array[0]))-2) + ' preguntas',
      buttons: [
        {
          text: 'Finalizar',
          cssClass: 'secondary',
          handler: (blah) => {
            this.router.navigate(['dash/tabs/tab2'])    
          }
        }
      ]
    });
    await alert.present();
  }
}
