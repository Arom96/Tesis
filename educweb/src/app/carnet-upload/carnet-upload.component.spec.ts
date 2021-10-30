import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetUploadComponent } from './carnet-upload.component';

describe('CarnetUploadComponent', () => {
  let component: CarnetUploadComponent;
  let fixture: ComponentFixture<CarnetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarnetUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarnetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
