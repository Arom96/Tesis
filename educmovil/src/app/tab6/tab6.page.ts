import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
})
export class Tab6Page implements OnInit {
  public id;
  public name;
  public preguntas = [];

  constructor(private router: Router, 
      private activatedRoute: ActivatedRoute, 
      private auth: AuthService
    ) { }

  ngOnInit() {
    console.log('carga')
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    let buffer = eval(this.activatedRoute.snapshot.paramMap.get('payload'));
    for(let s in buffer)
    {
      this.preguntas.push({primera: buffer[s]['1'], segunda: buffer[s]['2'], tercera: buffer[s]['3'], cuarta: buffer[s]['4'], pregunta: buffer[s]['pregunta'], correcta: buffer[s]['correcta']})
    }
    console.log(this.preguntas)
  }

  showResults(){
    let aciertos = 0;
    let total = this.preguntas.length;
    let payload = [];
    for(let s in this.preguntas)
    {
      let resp = (document.getElementById(s) as HTMLIonRadioElement).value;
      payload.push(resp);
      console.log(s, resp, this.preguntas[s]['correcta']);
      if(resp == this.preguntas[s]['correcta'])
      {
        aciertos+= 1;
      }
    }
    // Dialog.alert({
    //     title: 'Resultado',
    //     message: 'Usted obtuvo: ' + aciertos + ' respuestas correctas, de ' + total + ' preguntas \n'+aciertos+'/'+total,
    //   });
    //   window.history.back();
    this.changeTab(aciertos, payload);
    
  }

  changeTab(aciertos, payload)
  {
    this.router.navigate(['dash/tabs/tab7', { aciertos: aciertos, preguntas: JSON.stringify(this.preguntas), respuestas: JSON.stringify(payload) }]);
  }

  ionViewDidLeave() {
    for(let s in this.preguntas)
    {
      let elem = (document.getElementById(s) as HTMLIonRadioElement)
      if(elem != null)
      {
        elem.parentNode.removeChild(elem);
      }
      else
      {
        window.location.reload();
      }
      
    }

  }

  ionViewDidEnter(){
    for(let s in this.preguntas)
    {
      let elem = (document.getElementById(s) as HTMLIonRadioElement)
      if(elem == null)
      {
        window.location.reload();
      }
      
    }
  }

  

}
