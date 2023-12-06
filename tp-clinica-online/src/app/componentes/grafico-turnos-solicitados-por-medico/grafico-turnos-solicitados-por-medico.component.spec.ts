import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosSolicitadosPorMedicoComponent } from './grafico-turnos-solicitados-por-medico.component';

describe('GraficoTurnosSolicitadosPorMedicoComponent', () => {
  let component: GraficoTurnosSolicitadosPorMedicoComponent;
  let fixture: ComponentFixture<GraficoTurnosSolicitadosPorMedicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoTurnosSolicitadosPorMedicoComponent]
    });
    fixture = TestBed.createComponent(GraficoTurnosSolicitadosPorMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
