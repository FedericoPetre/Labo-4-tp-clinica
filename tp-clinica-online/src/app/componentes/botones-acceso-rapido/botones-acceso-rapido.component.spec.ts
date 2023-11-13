import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonesAccesoRapidoComponent } from './botones-acceso-rapido.component';

describe('BotonesAccesoRapidoComponent', () => {
  let component: BotonesAccesoRapidoComponent;
  let fixture: ComponentFixture<BotonesAccesoRapidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonesAccesoRapidoComponent]
    });
    fixture = TestBed.createComponent(BotonesAccesoRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
