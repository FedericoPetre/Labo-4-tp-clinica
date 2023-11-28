import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroUnicoComponent } from './filtro-unico.component';

describe('FiltroUnicoComponent', () => {
  let component: FiltroUnicoComponent;
  let fixture: ComponentFixture<FiltroUnicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroUnicoComponent]
    });
    fixture = TestBed.createComponent(FiltroUnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
