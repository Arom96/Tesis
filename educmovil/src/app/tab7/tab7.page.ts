import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
})
export class Tab7Page implements OnInit {  
  public preguntas = [];

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private auth: AuthService) { }

  ngOnInit() {
    let aciertos = this.activatedRoute.snapshot.paramMap.get('aciertos');
    let buffer = eval(this.activatedRoute.snapshot.paramMap.get("preguntas"));
    let respuestas = eval(this.activatedRoute.snapshot.paramMap.get('respuestas'));
    for(let s in buffer)
    {
      console.log(respuestas[s],buffer[s]['correcta'] )
      if(respuestas[s] == buffer[s]['correcta'])
      {
        this.preguntas.push({primera: buffer[s]['primera'], segunda: buffer[s]['segunda'], tercera: buffer[s]['tercera'], cuarta: buffer[s]['cuarta'], pregunta: buffer[s]['pregunta'], correcta: buffer[s]['correcta'], desc: 'Respuesta correcta!', correct: true})
      }
      else
      {
        let correctP = ''
        if(buffer[s]['correcta'] == '1')
        {
          correctP = buffer[s]['primera']
        }
        if(buffer[s]['correcta'] == '2')
        {
          correctP = buffer[s]['segunda']
        }
        if(buffer[s]['correcta'] == '3')
        {
          correctP = buffer[s]['tercera']
        }
        if(buffer[s]['correcta'] == '4')
        {
          correctP = buffer[s]['cuarta']
        }
        this.preguntas.push({primera: buffer[s]['primera'], segunda: buffer[s]['segunda'], tercera: buffer[s]['tercera'], cuarta: buffer[s]['cuarta'], pregunta: buffer[s]['pregunta'], correcta: buffer[s]['correcta'], desc: 'La respuesta correcta es: '+correctP, correct: false})
      }
      
    }
    console.log(this.preguntas)
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

  showResults(){
    this.router.navigate(['dash/tabs/tab2'])    
  }

}
