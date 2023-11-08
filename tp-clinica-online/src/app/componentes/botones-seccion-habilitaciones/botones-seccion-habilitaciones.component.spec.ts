import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonesSeccionHabilitacionesComponent } from './botones-seccion-habilitaciones.component';

describe('BotonesSeccionHabilitacionesComponent', () => {
  let component: BotonesSeccionHabilitacionesComponent;
  let fixture: ComponentFixture<BotonesSeccionHabilitacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonesSeccionHabilitacionesComponent]
    });
    fixture = TestBed.createComponent(BotonesSeccionHabilitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
