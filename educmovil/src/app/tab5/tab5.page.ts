import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  public id;
  public name;
  public lecturas = [];
  public pruebas = [];
  public result;
  public tests;
  public selection = 'all';
  slideOpts   = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthService, private location: Location) { }

  ngOnInit() {
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    let sub = this.auth.listCategories().subscribe(result =>{
      this.result = result;
      this.lecturas = [];
      this.pruebas = [];

      for(let s in result)
      {
        if(result[s]['id'] == this.id)
        {
          for(let i in result[s]['temas'])
          {
            if(result[s]['temas'][i]['nombre'] == this.name)
            {
              for(let f in result[s]['temas'][i]['lecturas'])
              {
                this.lecturas.push(result[s]['temas'][i]['lecturas'][f]);
                if(result[s]['temas'][i]['pruebas'][f] != undefined)
                {
                  this.pruebas.push(result[s]['temas'][i]['pruebas'][f]);
                }
                
              }
            }
            
          }
          
        }
      }
      console.log(this.lecturas, this.pruebas);
    })
  }

  changeTab(name, id)
  {
    this.router.navigate(['dash/tabs/tab6', { id: this.id, name: name, payload: JSON.stringify(id) }]);
  }

  openDoc(doc)
  {
    console.log(doc)
    window.open(doc, '_system', 'location=yes')
  }

  filter()
  {
    let val = (document.getElementById('filtro') as HTMLSelectElement).value;
    let nivel = ''
    if(val == 'all'){nivel = ''};
    if(val == 'basic'){nivel = 'Básico'};
    if(val == 'inter'){nivel = 'Intermedio'};
    if(val == 'adv'){nivel = 'Avanzado'};
    this.lecturas = [];
    this.pruebas = [];
    if(nivel == '')
    {
      for(let s in this.result)
      {
        if(this.result[s]['id'] == this.id)
        {
          for(let i in this.result[s]['temas'])
          {
            if(this.result[s]['temas'][i]['nombre'] == this.name)
            {
              for(let f in this.result[s]['temas'][i]['lecturas'])
              {
                this.lecturas.push(this.result[s]['temas'][i]['lecturas'][f]);
                if(this.result[s]['temas'][i]['pruebas'][f] != undefined)
                {
                  this.pruebas.push(this.result[s]['temas'][i]['pruebas'][f]);
                }
                
              }
            }
            
          }
          
        }
      }
    }
    else
    {
      for(let s in this.result)
      {
        if(this.result[s]['id'] == this.id)
        {
          for(let i in this.result[s]['temas'])
          {
            if(this.result[s]['temas'][i]['nombre'] == this.name)
            {
              for(let f in this.result[s]['temas'][i]['lecturas'])
              {
                if(this.result[s]['temas'][i]['lecturas'][f]['level'] == nivel)
                {
                  this.lecturas.push(this.result[s]['temas'][i]['lecturas'][f]);
                  if(this.result[s]['temas'][i]['pruebas'][f] != undefined)
                  {
                    this.pruebas.push(this.result[s]['temas'][i]['pruebas'][f]);
                  }
                }
              }
            }
            
          }
          
        }
      }
    }
    console.log(this.lecturas, this.pruebas);
    

  }

  goback(){
    //this.router.navigate(['dash/tabs/tab4'])
    this.location.back();
  }

}
