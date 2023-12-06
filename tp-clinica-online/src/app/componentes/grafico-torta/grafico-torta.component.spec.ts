import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTortaComponent } from './grafico-torta.component';

describe('GraficoTortaComponent', () => {
  let component: GraficoTortaComponent;
  let fixture: ComponentFixture<GraficoTortaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoTortaComponent]
    });
    fixture = TestBed.createComponent(GraficoTortaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
